import { NextRequest } from 'next/server'
import { ProductService } from '@/application/services/ProductService'
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository'
import { updateProductSchema } from '@/application/dtos/product.dto'
import {
  successResponse,
  errorResponse,
  requireAdminOrSeller,
  NotFoundError,
} from '@/lib/api-utils'

const productRepository = new ProductRepository()
const productService = new ProductService(productRepository)

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/products/[id] - Buscar produto por ID (público)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const product = await productService.getProductById(id)

    if (!product) {
      throw new NotFoundError('Produto não encontrado')
    }

    return successResponse(product)
  } catch (error) {
    return errorResponse(error)
  }
}

// PUT /api/products/[id] - Atualizar produto (admin/seller)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminOrSeller()

    const { id } = await params
    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    const product = await productService.updateProduct(id, validatedData)

    return successResponse(product)
  } catch (error) {
    return errorResponse(error)
  }
}

// DELETE /api/products/[id] - Deletar produto (admin/seller)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminOrSeller()

    const { id } = await params
    await productService.deleteProduct(id)

    return successResponse({ message: 'Produto deletado com sucesso' })
  } catch (error) {
    return errorResponse(error)
  }
}
