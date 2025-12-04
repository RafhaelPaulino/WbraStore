'use client'

import { SessionProvider } from 'next-auth/react'
import { CartDrawer } from '@/components/cart/cart-drawer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <CartDrawer />
    </SessionProvider>
  )
}
