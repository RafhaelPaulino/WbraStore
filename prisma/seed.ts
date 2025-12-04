import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wbrastore.com' },
    update: {},
    create: {
      email: 'admin@wbrastore.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create Categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Eletrônicos',
      slug: 'electronics',
      description: 'Produtos eletrônicos e tecnologia',
    },
  })

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Roupas',
      slug: 'clothing',
      description: 'Moda e vestuário',
    },
  })

  const books = await prisma.category.upsert({
    where: { slug: 'books' },
    update: {},
    create: {
      name: 'Livros',
      slug: 'books',
      description: 'Livros e publicações',
    },
  })

  console.log('✅ Categories created')

  // Create Sample Products
  const product1 = await prisma.product.upsert({
    where: { slug: 'smartphone-xyz' },
    update: {},
    create: {
      name: 'Smartphone XYZ Pro',
      slug: 'smartphone-xyz',
      description:
        'Smartphone de última geração com câmera de 108MP, 5G, 256GB de armazenamento e tela AMOLED de 6.7 polegadas.',
      price: 2999.99,
      compareAt: 3499.99,
      stock: 50,
      sku: 'PHONE-XYZ-001',
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      ],
      featured: true,
      active: true,
      categoryId: electronics.id,
    },
  })

  const product2 = await prisma.product.upsert({
    where: { slug: 'camiseta-basica' },
    update: {},
    create: {
      name: 'Camiseta Básica Premium',
      slug: 'camiseta-basica',
      description:
        'Camiseta 100% algodão, super confortável e respirável. Disponível em várias cores.',
      price: 79.9,
      stock: 100,
      sku: 'SHIRT-BASIC-001',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      ],
      featured: false,
      active: true,
      categoryId: clothing.id,
    },
  })

  const product3 = await prisma.product.upsert({
    where: { slug: 'livro-programacao' },
    update: {},
    create: {
      name: 'Clean Code - Código Limpo',
      slug: 'livro-programacao',
      description:
        'Um dos livros mais importantes sobre boas práticas de programação e desenvolvimento de software.',
      price: 89.9,
      stock: 30,
      sku: 'BOOK-CLEAN-001',
      images: [
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800',
      ],
      featured: true,
      active: true,
      categoryId: books.id,
    },
  })

  console.log('✅ Sample products created')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
