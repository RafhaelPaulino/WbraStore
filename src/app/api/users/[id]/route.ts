import { NextRequest } from 'next/server'
import { UserService } from '@/application/services/UserService'
import { adminUpdateUserSchema } from '@/application/dtos/user.dto'
import {
  successResponse,
  errorResponse,
  requireAdmin,
  NotFoundError,
} from '@/lib/api-utils'

const userService = new UserService()

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/users/[id] - Buscar usuário por ID (admin)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()

    const { id } = await params
    const user = await userService.getUserById(id)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    return successResponse(user)
  } catch (error) {
    return errorResponse(error)
  }
}

// PUT /api/users/[id] - Atualizar usuário (admin)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const validatedData = adminUpdateUserSchema.parse(body)

    const user = await userService.adminUpdateUser(id, validatedData)

    return successResponse(user)
  } catch (error) {
    return errorResponse(error)
  }
}

// DELETE /api/users/[id] - Deletar usuário (admin)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()

    const { id } = await params
    await userService.deleteUser(id)

    return successResponse({ message: 'Usuário deletado com sucesso' })
  } catch (error) {
    return errorResponse(error)
  }
}
