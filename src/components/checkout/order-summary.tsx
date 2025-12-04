import Image from 'next/image'

interface OrderSummaryProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string | null
  }>
  subtotal: number
  shipping: number
  total: number
}

export default function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <span className="text-xs">Sem imagem</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
              <p className="text-sm font-medium text-gray-900">
                R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">
            R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Frete</span>
          <span className="text-gray-900">
            R$ {shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
          <span>Total</span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          🔒 Seus dados estão seguros e protegidos
        </p>
      </div>
    </div>
  )
}
