'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          WbraStore
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-gray-700 hover:text-blue-600">
            Produtos
          </Link>

          {!isLoading && (
            <>
              {session ? (
                <>
                  <Link href="/cart" className="text-gray-700 hover:text-blue-600">
                    Carrinho
                  </Link>

                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
                    >
                      Admin
                    </Link>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">
                      Olá, <span className="font-medium">{session.user.name}</span>
                    </span>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                    >
                      Sair
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                  >
                    Registrar
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
