import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { ZodError } from 'zod'

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Não autorizado') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Acesso negado') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends ApiError {
  constructor(
    message = 'Dados inválidos',
    public errors?: Record<string, string[]>
  ) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

// Response helpers
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {}
    error.issues.forEach((issue) => {
      const path = issue.path.join('.')
      if (!formattedErrors[path]) {
        formattedErrors[path] = []
      }
      formattedErrors[path].push(issue.message)
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Dados inválidos',
        code: 'VALIDATION_ERROR',
        details: formattedErrors,
      },
      { status: 400 }
    )
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        ...(error instanceof ValidationError && error.errors
          ? { details: error.errors }
          : {}),
      },
      { status: error.statusCode }
    )
  }

  console.error('Unexpected error:', error)
  return NextResponse.json(
    {
      success: false,
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  )
}

// Auth helpers
export async function getAuthSession() {
  return await auth()
}

export async function requireAuth() {
  const session = await getAuthSession()

  if (!session?.user) {
    throw new UnauthorizedError()
  }

  return session
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth()

  if (!allowedRoles.includes(session.user.role)) {
    throw new ForbiddenError()
  }

  return session
}

export async function requireAdmin() {
  return requireRole(['ADMIN'])
}

export async function requireAdminOrSeller() {
  return requireRole(['ADMIN', 'SELLER'])
}

// Pagination helper
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12')))

  return { page, limit, skip: (page - 1) * limit }
}

export function paginationResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  }
}
