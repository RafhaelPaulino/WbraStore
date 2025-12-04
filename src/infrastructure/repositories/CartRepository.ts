import prisma from '@/lib/prisma'
import { ICartRepository } from '@/domain/repositories/ICartRepository'
import { Cart, CartWithProducts, AddToCartInput, UpdateCartItemInput } from '@/domain/entities/Cart'

export class CartRepository implements ICartRepository {
  async findByUserId(userId: string): Promise<CartWithProducts | null> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                stock: true,
              },
            },
          },
        },
      },
    })

    return cart as any | null
  }

  async createCart(userId: string): Promise<Cart> {
    const cart = await prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: true,
      },
    })

    return cart as any
  }

  async addItem(data: AddToCartInput): Promise<Cart> {
    // Buscar ou criar carrinho
    let cart = await prisma.cart.findUnique({
      where: { userId: data.userId },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: data.userId,
        },
      })
    }

    // Verificar se o item já existe no carrinho
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: data.productId,
        },
      },
    })

    if (existingItem) {
      // Atualizar quantidade
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: data.quantity,
          },
        },
      })
    } else {
      // Criar novo item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
        },
      })
    }

    // Retornar carrinho atualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: true,
      },
    })

    return updatedCart as any
  }

  async updateItem(data: UpdateCartItemInput): Promise<Cart> {
    const cartItem = await prisma.cartItem.update({
      where: { id: data.cartItemId },
      data: {
        quantity: data.quantity,
      },
    })

    const cart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: true,
      },
    })

    return cart as any
  }

  async removeItem(cartItemId: string): Promise<Cart> {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    })

    if (!cartItem) {
      throw new Error('Item do carrinho não encontrado')
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    })

    const cart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: true,
      },
    })

    return cart as any
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
    }
  }

  async getCartTotal(userId: string): Promise<number> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    })

    if (!cart) return 0

    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity
    }, 0)

    return total
  }
}
