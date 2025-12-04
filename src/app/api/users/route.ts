import { NextRequest } from 'next/server'
import { UserService } from '@/application/services/UserService'
import {
  successResponse,
  errorResponse,
  requireAdmin,
  getPaginationParams,
  paginationResponse,
} from '@/lib/api-utils'
import { UserRole } from '@prisma/client'

const userService = new UserService()

// GET /api/users - Listar usuários (admin)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const { page, limit } = getPaginationParams(searchParams)
    const role = searchParams.get('role') as UserRole | undefined
    const search = searchParams.get('search') || undefined

    const { users, total } = await userService.getUsers({
      page,
      limit,
      role,
      search,
    })

    return successResponse(paginationResponse(users, total, page, limit))
  } catch (error) {
    return errorResponse(error)
  }
}
