'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statusOptions = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'PAYMENT_PENDING', label: 'Aguardando Pagamento' },
  { value: 'PAID', label: 'Pago' },
  { value: 'PROCESSING', label: 'Processando' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregue' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'REFUNDED', label: 'Reembolsado' },
]

interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: string
}

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
}: OrderStatusUpdateProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleUpdate() {
    if (status === currentStatus) return

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status')
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao atualizar status')
      setStatus(currentStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {status !== currentStatus && (
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUpdating ? 'Salvando...' : 'Salvar'}
        </button>
      )}
    </div>
  )
}
