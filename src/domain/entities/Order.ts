import { OrderStatus } from '@prisma/client'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  total: number
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
}

export interface OrderWithDetails extends Order {
  user: {
    id: string
    name: string | null
    email: string
  }
  items: Array<
    OrderItem & {
      product: {
        id: string
        name: string
        slug: string
        images: string[]
      }
    }
  >
}

export type CreateOrderInput = {
  userId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  total: number
}

export type UpdateOrderStatusInput = {
  orderId: string
  status: OrderStatus
}
