export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  sku: string
  stock: number
  images: string[]
  categoryId: string
  featured: boolean
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductWithCategory extends Product {
  category: {
    id: string
    name: string
    slug: string
  }
}

export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateProductInput = Partial<CreateProductInput>
