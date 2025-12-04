import { Cart, CartWithProducts, AddToCartInput, UpdateCartItemInput } from '../entities/Cart'

export interface ICartRepository {
  findByUserId(userId: string): Promise<CartWithProducts | null>

  createCart(userId: string): Promise<Cart>

  addItem(data: AddToCartInput): Promise<Cart>

  updateItem(data: UpdateCartItemInput): Promise<Cart>

  removeItem(cartItemId: string): Promise<Cart>

  clearCart(userId: string): Promise<void>

  getCartTotal(userId: string): Promise<number>
}
