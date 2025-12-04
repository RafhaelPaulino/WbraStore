import { Header } from '@/components/layout/header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">Bem-vindo à WbraStore</h1>
          <p className="mt-4 text-xl text-gray-600">
            Sua loja completa de e-commerce com pagamento integrado
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/products"
              className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Ver Produtos
            </a>
            <a
              href="/login"
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50"
            >
              Entrar
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
