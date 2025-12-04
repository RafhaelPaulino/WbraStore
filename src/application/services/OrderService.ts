import { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import { ICartRepository } from '@/domain/repositories/ICartRepository'
import { IProductRepository } from '@/domain/repositories/IProductRepository'
import { CreateOrderInput, UpdateOrderStatusInput } from '@/domain/entities/Order'
import { OrderStatus } from '@prisma/client'

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository
  ) {}

  async getOrders(params?: { userId?: string; status?: string; page?: number; limit?: number }) {
    return await this.orderRepository.findAll(params)
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findById(id)

    if (!order) {
      throw new Error('Pedido não encontrado')
    }

    return order
  }

  async getOrderByNumber(orderNumber: string) {
    const order = await this.orderRepository.findByOrderNumber(orderNumber)

    if (!order) {
      throw new Error('Pedido não encontrado')
    }

    return order
  }

  async getUserOrders(userId: string) {
    return await this.orderRepository.findByUserId(userId)
  }

  async createOrderFromCart(userId: string) {
    // Buscar carrinho do usuário
    const cart = await this.cartRepository.findByUserId(userId)

    if (!cart || cart.items.length === 0) {
      throw new Error('Carrinho vazio')
    }

    // Validar estoque de todos os produtos
    for (const item of cart.items) {
      const hasStock = await this.productRepository.checkStock(item.productId, item.quantity)
      if (!hasStock) {
        throw new Error(`Estoque insuficiente para o produto ${item.product.name}`)
      }
    }

    // Calcular total
    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity
    }, 0)

    // Criar pedido
    const orderData: CreateOrderInput = {
      userId,
      total,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product.price),
      })),
    }

    const order = await this.orderRepository.create(orderData)

    // Decrementar estoque dos produtos
    for (const item of cart.items) {
      await this.productRepository.updateStock(item.productId, item.quantity)
    }

    // Limpar carrinho
    await this.cartRepository.clearCart(userId)

    return order
  }

  async updateOrderStatus(data: UpdateOrderStatusInput) {
    const order = await this.orderRepository.findById(data.orderId)

    if (!order) {
      throw new Error('Pedido não encontrado')
    }

    // Validar transição de status
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['PAYMENT_PENDING', 'CANCELLED'],
      PAYMENT_PENDING: ['PAID', 'CANCELLED'],
      PAID: ['PROCESSING', 'REFUNDED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED', 'CANCELLED'],
      DELIVERED: ['REFUNDED'],
      CANCELLED: [],
      REFUNDED: [],
    }

    const allowedStatuses = validTransitions[order.status]
    if (!allowedStatuses.includes(data.status)) {
      throw new Error(`Não é possível mudar status de ${order.status} para ${data.status}`)
    }

    return await this.orderRepository.updateStatus(data)
  }

  async cancelOrder(orderId: string) {
    return await this.updateOrderStatus({
      orderId,
      status: 'CANCELLED',
    })
  }
}
