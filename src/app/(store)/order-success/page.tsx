import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  if (!searchParams.orderId) {
    redirect('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Realizado com Sucesso!</h1>
        <p className="text-gray-600">
          Seu pedido foi confirmado e já está sendo processado.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Número do Pedido</p>
            <p className="text-lg font-semibold text-gray-900">#{searchParams.orderId.slice(0, 8)}</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-2">
              Você receberá um e-mail com os detalhes do seu pedido e informações de rastreamento.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Link
          href="/"
          className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continuar Comprando
        </Link>
        <Link
          href={`/admin/orders/${searchParams.orderId}`}
          className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Ver Detalhes do Pedido
        </Link>
      </div>

      <div className="mt-12 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Dica:</strong> Acompanhe o status do seu pedido em tempo real no painel de administração.
        </p>
      </div>
    </div>
  )
}
