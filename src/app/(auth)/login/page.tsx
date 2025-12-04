'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou senha inválidos')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass animate-fade-in max-w-md rounded-3xl p-8 shadow-2xl">
      {/* Logo and Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="relative h-16 w-16">
            <Image src="/wbra-logo.png" alt="Wbra Logo" fill className="object-contain" />
          </div>
        </div>
        <h1 className="gradient-text text-3xl font-bold">Bem-vindo de volta</h1>
        <p className="mt-2 text-gray-600">Entre para continuar sua jornada</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="animate-fade-in rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full rounded-xl border border-gray-200 bg-white/50 py-3 pl-12 pr-4 backdrop-blur-sm transition-all focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-white/50 py-3 pl-12 pr-4 backdrop-blur-sm transition-all focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-gradient group w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading ? 'Entrando...' : 'Entrar'}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        <span className="text-sm text-gray-500">ou</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link
            href="/register"
            className="font-semibold text-purple-600 transition-colors hover:text-purple-700"
          >
            Criar conta grátis
          </Link>
        </p>
      </div>

      {/* Test Credentials */}
      <div className="mt-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <p className="text-xs font-semibold text-gray-700">Para testar:</p>
        </div>
        <p className="text-xs font-mono text-gray-600">admin@wbrastore.com / admin123</p>
      </div>
    </div>
  )
}
