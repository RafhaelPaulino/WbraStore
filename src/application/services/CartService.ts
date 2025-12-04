import { ICartRepository } from '@/domain/repositories/ICartRepository'
import { IProductRepository } from '@/domain/repositories/IProductRepository'
import { AddToCartInput, UpdateCartItemInput } from '@/domain/entities/Cart'

export class CartService {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartRepository.findByUserId(userId)

    if (!cart) {
      await this.cartRepository.createCart(userId)
      cart = await this.cartRepository.findByUserId(userId)
    }

    return cart!
  }

  async addToCart(data: AddToCartInput) {
    // Verificar se produto existe
    const product = await this.productRepository.findById(data.productId)
    if (!product) {
      throw new Error('Produto não encontrado')
    }

    // Verificar se produto está ativo
    if (!product.active) {
      throw new Error('Produto não está disponível')
    }

    // Verificar estoque
    const hasStock = await this.productRepository.checkStock(data.productId, data.quantity)
    if (!hasStock) {
      throw new Error('Estoque insuficiente')
    }

    // Validar quantidade
    if (data.quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero')
    }

    return await this.cartRepository.addItem(data)
  }

  async updateCartItem(data: UpdateCartItemInput) {
    if (data.quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero')
    }

    return await this.cartRepository.updateItem(data)
  }

  async removeFromCart(cartItemId: string) {
    return await this.cartRepository.removeItem(cartItemId)
  }

  async clearCart(userId: string) {
    await this.cartRepository.clearCart(userId)
  }

  async getCartTotal(userId: string): Promise<number> {
    return await this.cartRepository.getCartTotal(userId)
  }
}
