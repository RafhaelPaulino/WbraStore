import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { AddToCartButton } from './add-to-cart-button'

async function getProduct(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products/slug/${slug}`,
    {
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) return null

  const data = await res.json()
  return data.success ? data.data : null
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const mainImage = product.images[0] || null
  const inStock = product.stock > 0

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag className="h-32 w-32 text-gray-300" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-6">
            {/* Category */}
            {product.category && (
              <div className="inline-flex w-fit items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
                {product.category.name}
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
              {!inStock && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  Produto indisponível
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
                R$ {Number(product.price).toFixed(2)}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900">Descrição</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Product Details */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">Detalhes</h2>
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">SKU</dt>
                  <dd className="font-medium text-gray-900">{product.sku}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Estoque</dt>
                  <dd className="font-medium text-gray-900">
                    {inStock ? `${product.stock} unidades` : 'Indisponível'}
                  </dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Status</dt>
                  <dd className="font-medium text-gray-900">
                    {product.active ? 'Ativo' : 'Inativo'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Add to Cart Button */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-white pt-6">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: Number(product.price),
                  image: mainImage,
                  stock: product.stock,
                }}
                disabled={!inStock}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
