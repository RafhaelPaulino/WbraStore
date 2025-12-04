import { NextRequest } from 'next/server'
import { ProductService } from '@/application/services/ProductService'
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository'
import { createProductSchema } from '@/application/dtos/product.dto'
import {
  successResponse,
  errorResponse,
  requireAdminOrSeller,
  getPaginationParams,
  paginationResponse,
} from '@/lib/api-utils'

const productRepository = new ProductRepository()
const productService = new ProductService(productRepository)

// GET /api/products - Listar produtos (público)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, limit } = getPaginationParams(searchParams)
    const categoryId = searchParams.get('categoryId') || undefined
    const search = searchParams.get('search') || undefined
    const featured = searchParams.get('featured')
      ? searchParams.get('featured') === 'true'
      : undefined

    const { products, total } = await productService.getProducts({
      page,
      limit,
      categoryId,
      search,
      featured,
    })

    return successResponse(paginationResponse(products, total, page, limit))
  } catch (error) {
    return errorResponse(error)
  }
}

// POST /api/products - Criar produto (admin/seller)
export async function POST(request: NextRequest) {
  try {
    await requireAdminOrSeller()

    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    const product = await productService.createProduct(validatedData)

    return successResponse(product, 201)
  } catch (error) {
    return errorResponse(error)
  }
}
