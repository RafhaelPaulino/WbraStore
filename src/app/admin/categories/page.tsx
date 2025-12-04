import { Suspense } from 'react'
import Link from 'next/link'
import CategoriesTable from '@/components/admin/categories-table'
import { Plus } from 'lucide-react'

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600 mt-1">Gerencie as categorias de produtos</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nova Categoria
        </Link>
      </div>

      <Suspense fallback={<div>Carregando categorias...</div>}>
        <CategoriesTable />
      </Suspense>
    </div>
  )
}
