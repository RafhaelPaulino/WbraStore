import { NextRequest } from 'next/server'
import { OrderService } from '@/application/services/OrderService'
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository'
import { CartRepository } from '@/infrastructure/repositories/CartRepository'
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository'
import { updateOrderStatusSchema } from '@/application/dtos/order.dto'
import {
  successResponse,
  errorResponse,
  requireAuth,
  requireAdmin,
  NotFoundError,
  ForbiddenError,
} from '@/lib/api-utils'

const orderRepository = new OrderRepository()
const cartRepository = new CartRepository()
const productRepository = new ProductRepository()
const orderService = new OrderService(orderRepository, cartRepository, productRepository)

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/orders/[id] - Buscar pedido por ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth()
    const { id } = await params

    const order = await orderService.getOrderById(id)

    if (!order) {
      throw new NotFoundError('Pedido não encontrado')
    }

    // Verificar se o usuário tem permissão para ver o pedido
    if (session.user.role !== 'ADMIN' && order.userId !== session.user.id) {
      throw new ForbiddenError('Você não tem permissão para ver este pedido')
    }

    return successResponse(order)
  } catch (error) {
    return errorResponse(error)
  }
}

// PUT /api/orders/[id] - Atualizar status do pedido (admin)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const { status } = updateOrderStatusSchema.parse(body)

    const order = await orderService.updateOrderStatus({
      orderId: id,
      status,
    })

    return successResponse(order)
  } catch (error) {
    return errorResponse(error)
  }
}

// DELETE /api/orders/[id] - Cancelar pedido
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth()
    const { id } = await params

    const order = await orderService.getOrderById(id)

    if (!order) {
      throw new NotFoundError('Pedido não encontrado')
    }

    // Verificar se o usuário tem permissão para cancelar o pedido
    if (session.user.role !== 'ADMIN' && order.userId !== session.user.id) {
      throw new ForbiddenError('Você não tem permissão para cancelar este pedido')
    }

    // Apenas pedidos pendentes podem ser cancelados por usuários normais
    if (
      session.user.role !== 'ADMIN' &&
      !['PENDING', 'PAYMENT_PENDING'].includes(order.status)
    ) {
      throw new ForbiddenError('Este pedido não pode mais ser cancelado')
    }

    await orderService.cancelOrder(id)

    return successResponse({ message: 'Pedido cancelado com sucesso' })
  } catch (error) {
    return errorResponse(error)
  }
}
