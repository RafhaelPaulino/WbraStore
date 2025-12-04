import { NextRequest } from 'next/server'
import { OrderService } from '@/application/services/OrderService'
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository'
import { CartRepository } from '@/infrastructure/repositories/CartRepository'
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository'
import {
  successResponse,
  errorResponse,
  requireAuth,
  requireAdmin,
  getPaginationParams,
  paginationResponse,
} from '@/lib/api-utils'

const orderRepository = new OrderRepository()
const cartRepository = new CartRepository()
const productRepository = new ProductRepository()
const orderService = new OrderService(orderRepository, cartRepository, productRepository)

// GET /api/orders - Listar pedidos
// Admin: lista todos, Usuário: lista apenas seus pedidos
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const { page, limit } = getPaginationParams(searchParams)
    const status = searchParams.get('status') || undefined

    // Se for admin, pode ver todos os pedidos
    // Se for usuário normal, só vê os próprios
    const params =
      session.user.role === 'ADMIN'
        ? { page, limit, status }
        : { userId: session.user.id, page, limit, status }

    const { orders, total } = await orderService.getOrders(params)

    return successResponse(paginationResponse(orders, total, page, limit))
  } catch (error) {
    return errorResponse(error)
  }
}

// POST /api/orders - Criar pedido a partir do carrinho
export async function POST() {
  try {
    const session = await requireAuth()

    const order = await orderService.createOrderFromCart(session.user.id)

    return successResponse(order, 201)
  } catch (error) {
    return errorResponse(error)
  }
}
