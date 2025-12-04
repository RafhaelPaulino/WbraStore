import { z } from 'zod'
import { OrderStatus } from '@prisma/client'

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().cuid('ID de produto inválido'),
      quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
      price: z.number().positive('Preço deve ser maior que zero'),
    })
  ),
  total: z.number().positive('Total deve ser maior que zero'),
})

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, { message: 'Status inválido' }),
})

export const getOrdersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  status: z.nativeEnum(OrderStatus).optional(),
})

export type CreateOrderDTO = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusDTO = z.infer<typeof updateOrderStatusSchema>
export type GetOrdersDTO = z.infer<typeof getOrdersSchema>
