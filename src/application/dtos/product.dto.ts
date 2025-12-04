import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres'),
  description: z.string().nullable().default(null),
  price: z.number().positive('Preço deve ser maior que zero'),
  sku: z.string().min(3, 'SKU deve ter no mínimo 3 caracteres'),
  stock: z.number().int().nonnegative('Estoque não pode ser negativo'),
  images: z.array(z.string().url('URL inválida')),
  categoryId: z.string().cuid('ID de categoria inválido'),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
})

export const updateProductSchema = createProductSchema.partial()

export const getProductsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(12),
  categoryId: z.string().cuid().optional(),
  search: z.string().optional(),
  featured: z.boolean().optional(),
})

export type CreateProductDTO = z.infer<typeof createProductSchema>
export type UpdateProductDTO = z.infer<typeof updateProductSchema>
export type GetProductsDTO = z.infer<typeof getProductsSchema>
