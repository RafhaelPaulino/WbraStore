import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import ProductForm from '@/components/admin/product-form'

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Produto</h1>
        <p className="text-gray-600 mt-1">Atualize as informações do produto</p>
      </div>

      <ProductForm product={product} />
    </div>
  )
}
