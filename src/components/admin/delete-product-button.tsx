'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface DeleteProductButtonProps {
  productId: string
}

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir produto')
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir produto')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
