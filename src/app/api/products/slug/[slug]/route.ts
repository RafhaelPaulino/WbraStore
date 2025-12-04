import { NextRequest } from 'next/server'
import { ProductService } from '@/application/services/ProductService'
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository'
import { successResponse, errorResponse, NotFoundError } from '@/lib/api-utils'

const productRepository = new ProductRepository()
const productService = new ProductService(productRepository)

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET /api/products/slug/[slug] - Buscar produto por slug (público)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const product = await productService.getProductBySlug(slug)

    if (!product) {
      throw new NotFoundError('Produto não encontrado')
    }

    return successResponse(product)
  } catch (error) {
    return errorResponse(error)
  }
}
