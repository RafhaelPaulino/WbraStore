import { Header } from '@/components/layout/header'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'

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
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Minimal like Apple */}
      <section className="relative overflow-hidden pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="animate-fade-in mb-2 text-4xl font-semibold text-gray-900 md:text-5xl">
              Tecnologia que inspira. Preços que cabem no bolso.
            </h1>
            <p className="animate-fade-in text-lg text-gray-600">
              Descubra produtos incríveis com qualidade garantida.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="border-b border-gray-200 py-4">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="text-xs font-normal text-gray-700 transition-opacity hover:opacity-70"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <h2 className="mb-8 text-2xl font-semibold text-gray-900">Mais Comprados</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {bestSellers.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-2xl bg-gray-50 transition-all duration-300 hover:shadow-lg">
                    {/* Product Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-white">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-300">
                          <span className="text-sm">Sem imagem</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-1 text-xs font-medium text-blue-600">
                        {product.category.name}
                      </div>
                      <h3 className="mb-2 text-base font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
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
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="mb-8 text-2xl font-semibold text-gray-900">Todos os Produtos</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {otherProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-lg">
                    {/* Product Image */}
                    <div className="relative aspect-square w-full overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-50 text-gray-300">
                          <span className="text-sm">Sem imagem</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-1 text-xs font-medium text-blue-600">
                        {product.category.name}
                      </div>
                      <h3 className="mb-2 text-base font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
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
          <p className="text-xs">© 2025 WbraStore. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
