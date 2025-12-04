export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import UsersTable from '@/components/admin/users-table'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <p className="text-gray-600 mt-1">Gerencie os usuários da plataforma</p>
      </div>

      <Suspense fallback={<div>Carregando usuários...</div>}>
        <UsersTable />
      </Suspense>
    </div>
  )
}
