'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, LogOut, Shield } from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  return (
    <header className="glass fixed left-0 right-0 top-0 z-50 border-b border-white/20">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <div className="relative h-10 w-10">
            <Image
              src="/images/Wbra.png"
              alt="Wbra Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="gradient-text text-2xl font-bold">WbraStore</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
          >
            Produtos
          </Link>

          {!isLoading && (
            <>
              {session ? (
                <>
                  <Link
                    href="/cart"
                    className="relative flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Carrinho</span>
                  </Link>

                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-slate-800">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-2 rounded-xl bg-white/50 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm transition-all hover:bg-white/80"
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
                    className="rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-white/50"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="btn-gradient rounded-xl px-6 py-2.5 text-sm shadow-lg"
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
