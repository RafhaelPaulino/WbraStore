import prisma from '@/lib/prisma'
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/domain/entities/Category'

export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return categories as any[]
  }

  async findById(id: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    return category as any | null
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { slug },
    })

    return category as any | null
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    const category = await prisma.category.create({
      data,
    })

    return category as any
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const category = await prisma.category.update({
      where: { id },
      data,
    })

    return category as any
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    })
  }
}
