'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, LogOut, Shield } from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="container mx-auto flex h-11 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-70">
          <div className="relative h-6 w-6">
            <Image
              src="/images/Wbra.png"
              alt="Wbra Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-semibold text-gray-900">WbraStore</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-xs font-normal text-gray-700 transition-opacity hover:opacity-70"
          >
            Produtos
          </Link>

          {!isLoading && (
            <>
              {session ? (
                <>
                  <Link
                    href="/cart"
                    className="relative flex items-center gap-1 text-xs font-normal text-gray-700 transition-opacity hover:opacity-70"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Carrinho</span>
                  </Link>

                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80"
                    >
                      <Shield className="h-3 w-3" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-700" />
                      <span className="text-xs font-normal text-gray-900">
                        {session.user.name}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-1 text-xs font-normal text-gray-700 transition-opacity hover:opacity-70"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-xs font-normal text-gray-700 transition-opacity hover:opacity-70"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80"
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
