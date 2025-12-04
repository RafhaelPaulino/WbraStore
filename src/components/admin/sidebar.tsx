'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Settings,
  Home,
} from 'lucide-react'

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    label: 'Produtos',
    icon: Package,
    href: '/admin/products',
  },
  {
    label: 'Categorias',
    icon: FolderTree,
    href: '/admin/categories',
  },
  {
    label: 'Pedidos',
    icon: ShoppingCart,
    href: '/admin/orders',
  },
  {
    label: 'Usuários',
    icon: Users,
    href: '/admin/users',
  },
  {
    label: 'Configurações',
    icon: Settings,
    href: '/admin/settings',
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Home className="h-6 w-6" />
          <span>WbraStore</span>
        </Link>
        <p className="text-sm text-gray-500 mt-1">Painel Admin</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <Home className="h-4 w-4" />
          <span>Voltar para loja</span>
        </Link>
      </div>
    </aside>
  )
}
