import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres'),
  description: z.string().nullable().default(null),
  image: z.string().url('URL inválida').nullable().default(null),
})

export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>
