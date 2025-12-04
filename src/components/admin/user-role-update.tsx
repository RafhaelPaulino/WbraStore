'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const roleOptions = [
  { value: 'BUYER', label: 'Comprador' },
  { value: 'SELLER', label: 'Vendedor' },
  { value: 'ADMIN', label: 'Administrador' },
]

interface UserRoleUpdateProps {
  userId: string
  currentRole: string
}

export default function UserRoleUpdate({
  userId,
  currentRole,
}: UserRoleUpdateProps) {
  const router = useRouter()
  const [role, setRole] = useState(currentRole)
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleUpdate(newRole: string) {
    if (newRole === currentRole) return

    if (!confirm('Tem certeza que deseja alterar o tipo de usuário?')) {
      setRole(currentRole)
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar usuário')
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao atualizar usuário')
      setRole(currentRole)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <select
      value={role}
      onChange={(e) => {
        setRole(e.target.value)
        handleUpdate(e.target.value)
      }}
      disabled={isUpdating}
      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {roleOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
