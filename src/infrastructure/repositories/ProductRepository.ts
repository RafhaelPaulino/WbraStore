import prisma from '@/lib/prisma'
import { IProductRepository } from '@/domain/repositories/IProductRepository'
import {
  Product,
  ProductWithCategory,
  CreateProductInput,
  UpdateProductInput,
} from '@/domain/entities/Product'

export class ProductRepository implements IProductRepository {
  async findAll(params?: {
    page?: number
    limit?: number
    categoryId?: string
    search?: string
    featured?: boolean
  }): Promise<{ products: ProductWithCategory[]; total: number }> {
    const page = params?.page || 1
    const limit = params?.limit || 12
    const skip = (page - 1) * limit

    const where: any = { active: true }

    if (params?.categoryId) {
      where.categoryId = params.categoryId
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    if (params?.featured !== undefined) {
      where.featured = params.featured
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where }),
    ])

    return { products: products as any[], total }
  }

  async findById(id: string): Promise<ProductWithCategory | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return product as any | null
  }

  async findBySlug(slug: string): Promise<ProductWithCategory | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return product as any | null
  }

  async create(data: CreateProductInput): Promise<Product> {
    const product = await prisma.product.create({
      data: ({ 
        ...data,
        price: data.price,
      }) as any,
    })

    return product as any
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    const product = await prisma.product.update({
      where: { id },
      data: ({
        ...data,
        price: data.price ? data.price : undefined,
      }) as any,
    })

    return product as any
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    })
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await prisma.product.update({
      where: { id },
      data: { 
        stock: {
          decrement: quantity,
        },
      },
    })

    return product as any
  }

  async checkStock(id: string, quantity: number): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { stock: true },
    })

    return product ? product.stock >= quantity : false
  }
}
