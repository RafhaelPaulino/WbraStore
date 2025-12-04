import { z } from 'zod'

export const addToCartSchema = z.object({
  productId: z.string().cuid('ID de produto inválido'),
  quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
})

export const updateCartItemSchema = z.object({
  cartItemId: z.string().cuid('ID de item inválido'),
  quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
})

export const removeFromCartSchema = z.object({
  cartItemId: z.string().cuid('ID de item inválido'),
})

export type AddToCartDTO = z.infer<typeof addToCartSchema>
export type UpdateCartItemDTO = z.infer<typeof updateCartItemSchema>
export type RemoveFromCartDTO = z.infer<typeof removeFromCartSchema>
