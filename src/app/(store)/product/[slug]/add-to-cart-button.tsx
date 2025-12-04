'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Minus, Plus } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string | null
  stock: number
}

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { data: session } = useSession()
  const router = useRouter()
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    if (!session) {
      router.push('/login')
      return
    }

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      image: product.image,
      stock: product.stock,
    })
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Quantity Selector */}
      <div className="flex items-center gap-3 rounded-lg border border-gray-300 p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={decrementQuantity}
          disabled={quantity <= 1 || disabled}
          className="h-10 w-10"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-[3rem] text-center text-lg font-semibold">
          {quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={incrementQuantity}
          disabled={quantity >= product.stock || disabled}
          className="h-10 w-10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={disabled}
        size="lg"
        className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-base font-semibold hover:from-blue-700 hover:to-purple-700"
      >
        <ShoppingCart className="h-5 w-5" />
        {disabled ? 'Indisponível' : 'Adicionar ao Carrinho'}
      </Button>
    </div>
  )
}
