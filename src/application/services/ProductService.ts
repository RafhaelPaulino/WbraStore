import { IProductRepository } from '@/domain/repositories/IProductRepository'
import { CreateProductInput, UpdateProductInput } from '@/domain/entities/Product'

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async getProducts(params?: {
    page?: number
    limit?: number
    categoryId?: string
    search?: string
    featured?: boolean
  }) {
    return await this.productRepository.findAll(params)
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new Error('Produto não encontrado')
    }

    return product
  }

  async getProductBySlug(slug: string) {
    const product = await this.productRepository.findBySlug(slug)

    if (!product) {
      throw new Error('Produto não encontrado')
    }

    return product
  }

  async createProduct(data: CreateProductInput) {
    // Validar dados
    if (!data.name || !data.slug || !data.price) {
      throw new Error('Dados inválidos')
    }

    if (data.price <= 0) {
      throw new Error('Preço deve ser maior que zero')
    }

    if (data.stock < 0) {
      throw new Error('Estoque não pode ser negativo')
    }

    // Verificar se slug já existe
    const existingProduct = await this.productRepository.findBySlug(data.slug)
    if (existingProduct) {
      throw new Error('Slug já está em uso')
    }

    return await this.productRepository.create(data)
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    // Verificar se produto existe
    const existingProduct = await this.productRepository.findById(id)
    if (!existingProduct) {
      throw new Error('Produto não encontrado')
    }

    // Validar dados
    if (data.price !== undefined && data.price <= 0) {
      throw new Error('Preço deve ser maior que zero')
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new Error('Estoque não pode ser negativo')
    }

    // Verificar slug duplicado
    if (data.slug && data.slug !== existingProduct.slug) {
      const slugExists = await this.productRepository.findBySlug(data.slug)
      if (slugExists) {
        throw new Error('Slug já está em uso')
      }
    }

    return await this.productRepository.update(id, data)
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new Error('Produto não encontrado')
    }

    await this.productRepository.delete(id)
  }

  async checkProductStock(id: string, quantity: number): Promise<boolean> {
    return await this.productRepository.checkStock(id, quantity)
  }

  async decrementStock(id: string, quantity: number) {
    const hasStock = await this.checkProductStock(id, quantity)

    if (!hasStock) {
      throw new Error('Estoque insuficiente')
    }

    return await this.productRepository.updateStock(id, quantity)
  }
}
