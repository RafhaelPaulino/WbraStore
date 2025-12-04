import { Header } from '@/components/layout/header'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Minimal like Apple */}
      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="animate-fade-in mb-4 text-5xl font-bold leading-tight md:text-6xl">
              <span className="gradient-text">WbraStore</span>
            </h1>
            <p className="animate-fade-in text-xl text-gray-600 md:text-2xl">
              Tecnologia que você ama. Preços que você pode pagar.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid - Apple Style */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">Nenhum produto disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
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
                          <span>Sem imagem</span>
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
                      {product.description && (
                        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold gradient-text">
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
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 mt-20">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© 2025 WbraStore. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
