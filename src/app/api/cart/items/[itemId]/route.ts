import { NextRequest } from 'next/server'
import { CartService } from '@/application/services/CartService'
import { CartRepository } from '@/infrastructure/repositories/CartRepository'
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository'
import { updateCartItemSchema } from '@/application/dtos/cart.dto'
import { successResponse, errorResponse, requireAuth } from '@/lib/api-utils'

const cartRepository = new CartRepository()
const productRepository = new ProductRepository()
const cartService = new CartService(cartRepository, productRepository)

interface RouteParams {
  params: Promise<{ itemId: string }>
}

// PUT /api/cart/items/[itemId] - Atualizar quantidade de item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth()
    const { itemId } = await params
    const body = await request.json()

    const validatedData = updateCartItemSchema.parse({
      cartItemId: itemId,
      quantity: body.quantity,
    })

    await cartService.updateCartItem(validatedData)

    // Retornar carrinho atualizado
    const cart = await cartService.getCart(session.user.id)
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

// DELETE /api/cart/items/[itemId] - Remover item do carrinho
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth()
    const { itemId } = await params

    await cartService.removeFromCart(itemId)

    // Retornar carrinho atualizado
    const cart = await cartService.getCart(session.user.id)
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
