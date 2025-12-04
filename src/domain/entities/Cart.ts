export interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export interface Cart {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
  items: CartItem[]
}

export interface CartWithProducts extends Cart {
  items: Array<
    CartItem & {
      product: {
        id: string
        name: string
        slug: string
        price: number
        images: string[]
        stock: number
      }
    }
  >
}

export type AddToCartInput = {
  userId: string
  productId: string
  quantity: number
}

export type UpdateCartItemInput = {
  cartItemId: string
  quantity: number
}

export type RemoveFromCartInput = {
  cartItemId: string
}
