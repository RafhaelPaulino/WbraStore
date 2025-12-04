export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Suspense } from 'react'
import ProductsTable from '@/components/admin/products-table'
import { Plus } from 'lucide-react'

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Novo Produto
        </Link>
      </div>

      <Suspense fallback={<div>Carregando produtos...</div>}>
        <ProductsTable />
      </Suspense>
    </div>
  )
}
