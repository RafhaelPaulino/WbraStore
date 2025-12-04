import ProductForm from '@/components/admin/product-form'

export default function NewProductPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Novo Produto</h1>
        <p className="text-gray-600 mt-1">Adicione um novo produto ao catálogo</p>
      </div>

      <ProductForm />
    </div>
  )
}
