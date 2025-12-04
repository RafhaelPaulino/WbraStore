import { Order, OrderWithDetails, CreateOrderInput, UpdateOrderStatusInput } from '../entities/Order'

export interface IOrderRepository {
  findAll(params?: { userId?: string; status?: string; page?: number; limit?: number }): Promise<{
    orders: OrderWithDetails[]
    total: number
  }>

  findById(id: string): Promise<OrderWithDetails | null>

  findByOrderNumber(orderNumber: string): Promise<OrderWithDetails | null>

  findByUserId(userId: string): Promise<OrderWithDetails[]>

  create(data: CreateOrderInput): Promise<Order>

  updateStatus(data: UpdateOrderStatusInput): Promise<Order>

  delete(id: string): Promise<void>
}
