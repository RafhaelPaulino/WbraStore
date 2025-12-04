import { NextRequest } from 'next/server'
import { UserService } from '@/application/services/UserService'
import {
  updateUserSchema,
  updateUserPasswordSchema,
} from '@/application/dtos/user.dto'
import { successResponse, errorResponse, requireAuth } from '@/lib/api-utils'

const userService = new UserService()

// GET /api/users/me - Buscar perfil do usuário logado
export async function GET() {
  try {
    const session = await requireAuth()
    const user = await userService.getUserById(session.user.id)

    return successResponse(user)
  } catch (error) {
    return errorResponse(error)
  }
}

// PUT /api/users/me - Atualizar perfil do usuário logado
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    const user = await userService.updateUser(session.user.id, validatedData)

    return successResponse(user)
  } catch (error) {
    return errorResponse(error)
  }
}

// PATCH /api/users/me - Atualizar senha do usuário logado
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const validatedData = updateUserPasswordSchema.parse(body)

    await userService.updatePassword({
      userId: session.user.id,
      ...validatedData,
    })

    return successResponse({ message: 'Senha atualizada com sucesso' })
  } catch (error) {
    return errorResponse(error)
  }
}
