import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import { CreateCategoryInput, UpdateCategoryInput } from '@/domain/entities/Category'

export class CategoryService {
  constructor(private categoryRepository: ICategoryRepository) {}

  async getCategories() {
    return await this.categoryRepository.findAll()
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id)

    if (!category) {
      throw new Error('Categoria não encontrada')
    }

    return category
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.categoryRepository.findBySlug(slug)

    if (!category) {
      throw new Error('Categoria não encontrada')
    }

    return category
  }

  async createCategory(data: CreateCategoryInput) {
    // Validar dados
    if (!data.name || !data.slug) {
      throw new Error('Nome e slug são obrigatórios')
    }

    // Verificar se slug já existe
    const existingCategory = await this.categoryRepository.findBySlug(data.slug)
    if (existingCategory) {
      throw new Error('Slug já está em uso')
    }

    return await this.categoryRepository.create(data)
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    // Verificar se categoria existe
    const existingCategory = await this.categoryRepository.findById(id)
    if (!existingCategory) {
      throw new Error('Categoria não encontrada')
    }

    // Verificar slug duplicado
    if (data.slug && data.slug !== existingCategory.slug) {
      const slugExists = await this.categoryRepository.findBySlug(data.slug)
      if (slugExists) {
        throw new Error('Slug já está em uso')
      }
    }

    return await this.categoryRepository.update(id, data)
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findById(id)

    if (!category) {
      throw new Error('Categoria não encontrada')
    }

    await this.categoryRepository.delete(id)
  }
}
