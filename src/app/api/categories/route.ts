import { NextRequest } from 'next/server'
import { CategoryService } from '@/application/services/CategoryService'
import { CategoryRepository } from '@/infrastructure/repositories/CategoryRepository'
import { createCategorySchema } from '@/application/dtos/category.dto'
import {
  successResponse,
  errorResponse,
  requireAdmin,
} from '@/lib/api-utils'

const categoryRepository = new CategoryRepository()
const categoryService = new CategoryService(categoryRepository)

// GET /api/categories - Listar categorias (público)
export async function GET() {
  try {
    const categories = await categoryService.getCategories()

    return successResponse(categories)
  } catch (error) {
    return errorResponse(error)
  }
}

// POST /api/categories - Criar categoria (admin)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    const category = await categoryService.createCategory(validatedData)

    return successResponse(category, 201)
  } catch (error) {
    return errorResponse(error)
  }
}
