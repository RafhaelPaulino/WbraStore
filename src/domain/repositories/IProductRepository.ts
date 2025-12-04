import { Product, ProductWithCategory, CreateProductInput, UpdateProductInput } from '../entities/Product'

export interface IProductRepository {
  findAll(params?: {
    page?: number
    limit?: number
    categoryId?: string
    search?: string
    featured?: boolean
  }): Promise<{ products: ProductWithCategory[]; total: number }>

  findById(id: string): Promise<ProductWithCategory | null>

  findBySlug(slug: string): Promise<ProductWithCategory | null>

  create(data: CreateProductInput): Promise<Product>

  update(id: string, data: UpdateProductInput): Promise<Product>

  delete(id: string): Promise<void>

  updateStock(id: string, quantity: number): Promise<Product>

  checkStock(id: string, quantity: number): Promise<boolean>
}
