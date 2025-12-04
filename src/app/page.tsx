import { Header } from '@/components/layout/header'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'

// Mapeamento de imagens placeholder para categorias
const categoryImages: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop',
  clothing: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop',
  books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop',
}

async function getDataForHome() {
  try {
    const [categories, allProducts] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.product.findMany({
        include: {
          category: true,
          orderItems: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])

    // Separar produtos mais comprados (ordenar por quantidade de pedidos)
    const productsWithOrderCount = allProducts.map((product) => ({
      ...product,
      orderCount: product.orderItems.length,
    }))

    const bestSellers = productsWithOrderCount
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 8)

    const otherProducts = productsWithOrderCount
      .filter((p) => !bestSellers.find((bs) => bs.id === p.id))
      .slice(0, 12)

    return { categories, bestSellers, otherProducts }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { categories: [], bestSellers: [], otherProducts: [] }
  }
}

export default async function HomePage() {
  const { categories, bestSellers, otherProducts } = await getDataForHome()

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden pt-20 pb-12">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-slate-600 opacity-20 blur-3xl" />
        </div>

        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="animate-fade-in mb-4 text-4xl font-bold leading-tight md:text-5xl">
              <span className="gradient-text">Tecnologia que inspira.</span>
              <br />
              Preços que cabem no bolso.
            </h1>
            <p className="animate-fade-in text-lg text-gray-600">
              Descubra produtos incríveis com qualidade garantida.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section - Apple Style */}
      {categories.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-12">
              {categories.map((category) => {
                const imageUrl = category.image || categoryImages[category.slug] || categoryImages.electronics
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="group flex flex-col items-center"
                  >
                    {/* Category Image */}
                    <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-110">
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Category Name */}
                    <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                      {category.name}
                    </h3>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Mais Comprados</h2>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {bestSellers.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="glass overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    {/* Product Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <span className="text-sm">Sem imagem</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                        {product.category.name}
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="gradient-text text-2xl font-bold">
                          R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        {product.stock > 0 ? (
                          <span className="text-xs font-semibold text-green-600">
                            Em estoque
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-red-600">
                            Esgotado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Products Section */}
      {otherProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Todos os Produtos</h2>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {otherProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="glass overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    {/* Product Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <span className="text-sm">Sem imagem</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                        {product.category.name}
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="gradient-text text-2xl font-bold">
                          R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        {product.stock > 0 ? (
                          <span className="text-xs font-semibold text-green-600">
                            Em estoque
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-red-600">
                            Esgotado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {bestSellers.length === 0 && otherProducts.length === 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <p className="text-xl text-gray-600">Nenhum produto disponível no momento.</p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 mt-20">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© 2025 WbraStore. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
