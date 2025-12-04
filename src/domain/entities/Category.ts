export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export type CreateCategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateCategoryInput = Partial<CreateCategoryInput>
