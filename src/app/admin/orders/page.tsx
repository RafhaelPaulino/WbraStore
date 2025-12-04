export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import OrdersTable from '@/components/admin/orders-table'

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600 mt-1">Gerencie todos os pedidos da loja</p>
      </div>

      <Suspense fallback={<div>Carregando pedidos...</div>}>
        <OrdersTable />
      </Suspense>
    </div>
  )
}
