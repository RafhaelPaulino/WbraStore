import { NextRequest } from 'next/server'
import { CategoryService } from '@/application/services/CategoryService'
import { CategoryRepository } from '@/infrastructure/repositories/CategoryRepository'
import { updateCategorySchema } from '@/application/dtos/category.dto'
import {
  successResponse,
  errorResponse,
  requireAdmin,
  NotFoundError,
} from '@/lib/api-utils'

const categoryRepository = new CategoryRepository()
const categoryService = new CategoryService(categoryRepository)

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/categories/[id] - Buscar categoria por ID (público)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const category = await categoryService.getCategoryById(id)

    if (!category) {
      throw new NotFoundError('Categoria não encontrada')
    }

    return successResponse(category)
  } catch (error) {
    return errorResponse(error)
  }
}

// PUT /api/categories/[id] - Atualizar categoria (admin)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const validatedData = updateCategorySchema.parse(body)

    const category = await categoryService.updateCategory(id, validatedData)

    return successResponse(category)
  } catch (error) {
    return errorResponse(error)
  }
}

// DELETE /api/categories/[id] - Deletar categoria (admin)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()

    const { id } = await params
    await categoryService.deleteCategory(id)

    return successResponse({ message: 'Categoria deletada com sucesso' })
  } catch (error) {
    return errorResponse(error)
  }
}
