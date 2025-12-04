import { NextRequest } from 'next/server'
import { CartService } from '@/application/services/CartService'
import { CartRepository } from '@/infrastructure/repositories/CartRepository'
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository'
import { addToCartSchema } from '@/application/dtos/cart.dto'
import { successResponse, errorResponse, requireAuth } from '@/lib/api-utils'

const cartRepository = new CartRepository()
const productRepository = new ProductRepository()
const cartService = new CartService(cartRepository, productRepository)

// GET /api/cart - Buscar carrinho do usuário logado
export async function GET() {
  try {
    const session = await requireAuth()
    const cart = await cartService.getCart(session.user.id)

    // Calcular totais
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity
    }, 0)

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    return successResponse({
      ...cart,
      subtotal,
      itemCount,
    })
  } catch (error) {
    return errorResponse(error)
  }
}

// POST /api/cart - Adicionar item ao carrinho
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const validatedData = addToCartSchema.parse(body)

    await cartService.addToCart({
      userId: session.user.id,
      ...validatedData,
    })

    // Retornar carrinho atualizado
    const cart = await cartService.getCart(session.user.id)
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity
    }, 0)
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    return successResponse(
      {
        ...cart,
        subtotal,
        itemCount,
      },
      201
    )
  } catch (error) {
    return errorResponse(error)
  }
}

// DELETE /api/cart - Limpar carrinho
export async function DELETE() {
  try {
    const session = await requireAuth()
    await cartService.clearCart(session.user.id)

    return successResponse({ message: 'Carrinho limpo com sucesso' })
  } catch (error) {
    return errorResponse(error)
  }
}
