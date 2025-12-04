import prisma from '@/lib/prisma'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'

export default async function DashboardMetrics() {
  // Buscar métricas em paralelo
  const [totalRevenue, totalOrders, totalProducts, totalUsers] = await Promise.all([
    // Receita total (pedidos pagos)
    prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { total: true },
    }),
    // Total de pedidos
    prisma.order.count(),
    // Total de produtos
    prisma.product.count(),
    // Total de usuários
    prisma.user.count(),
  ])

  const metrics = [
    {
      label: 'Receita Total',
      value: `R$ ${Number(totalRevenue._sum.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Pedidos',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Produtos',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Usuários',
      value: totalUsers.toString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div
            key={metric.label}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {metric.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-6 w-6 ${metric.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
