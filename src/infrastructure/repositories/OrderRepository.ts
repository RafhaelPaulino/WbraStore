import prisma from '@/lib/prisma'
import { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import { Order, OrderWithDetails, CreateOrderInput, UpdateOrderStatusInput } from '@/domain/entities/Order'

export class OrderRepository implements IOrderRepository {
  async findAll(params?: {
    userId?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<{ orders: OrderWithDetails[]; total: number }> {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const skip = (page - 1) * limit

    const where: any = {}

    if (params?.userId) {
      where.userId = params.userId
    }

    if (params?.status) {
      where.status = params.status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.order.count({ where }),
    ])

    return { orders: orders as any, total }
  }

  async findById(id: string): Promise<OrderWithDetails | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    })

    return order as any
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderWithDetails | null> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    })

    return order as any
  }

  async findByUserId(userId: string): Promise<OrderWithDetails[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return orders as any
  }

  async create(data: CreateOrderInput): Promise<Order> {
    // Gerar número de pedido único
    const orderNumber = `ORD-${Date.now()}`

    // Buscar produtos para pegar name e image
    const productIds = data.items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, images: true },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        total: data.total,
        status: 'PENDING',
        items: {
          create: data.items.map((item) => {
            const product = productMap.get(item.productId)!
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              name: product.name,
              image: product.images[0] || null,
            }
          }),
        },
      } as any,
      include: {
        items: true,
      },
    })

    return order as any
  }

  async updateStatus(data: UpdateOrderStatusInput): Promise<Order> {
    const order = await prisma.order.update({
      where: { id: data.orderId },
      data: {
        status: data.status,
      },
      include: {
        items: true,
      },
    })

    return order as any
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id },
    })
  }
}
