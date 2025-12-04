import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'

interface UpdateUserInput {
  name?: string
  email?: string
  image?: string | null
}

interface AdminUpdateUserInput {
  name?: string
  email?: string
  role?: UserRole
  image?: string | null
}

interface UpdatePasswordInput {
  userId: string
  currentPassword: string
  newPassword: string
}

export class UserService {
  async getUsers(params?: {
    page?: number
    limit?: number
    role?: UserRole
    search?: string
  }) {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const skip = (page - 1) * limit

    const where: any = {}

    if (params?.role) {
      where.role = params.role
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({ where }),
    ])

    return { users, total }
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    return user
  }

  async updateUser(id: string, data: UpdateUserInput) {
    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      throw new Error('Usuário não encontrado')
    }

    // Verificar email duplicado
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      })
      if (emailExists) {
        throw new Error('Email já está em uso')
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  }

  async adminUpdateUser(id: string, data: AdminUpdateUserInput) {
    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      throw new Error('Usuário não encontrado')
    }

    // Verificar email duplicado
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      })
      if (emailExists) {
        throw new Error('Email já está em uso')
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  }

  async updatePassword(data: UpdatePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    })

    if (!user || !user.password) {
      throw new Error('Usuário não encontrado')
    }

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password)
    if (!isPasswordValid) {
      throw new Error('Senha atual incorreta')
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(data.newPassword, 12)

    await prisma.user.update({
      where: { id: data.userId },
      data: { password: hashedPassword },
    })
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    await prisma.user.delete({
      where: { id },
    })
  }
}
