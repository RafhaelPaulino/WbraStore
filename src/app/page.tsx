import { Header } from '@/components/layout/header'
import { Sparkles, Zap, Shield, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 blur-3xl" />
        </div>

        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-900">
                Powered by AI & Modern Technology
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="animate-fade-in mb-6 text-6xl font-bold leading-tight md:text-7xl">
              O futuro do
              <span className="gradient-text"> e-commerce</span>
              <br />
              está aqui
            </h1>

            {/* Subheading */}
            <p className="animate-fade-in mb-12 text-xl text-gray-600 md:text-2xl">
              Experiência de compra revolucionária com pagamentos seguros,
              <br />
              interface moderna e tecnologia de ponta.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="btn-gradient group flex items-center gap-2 px-8 py-4 text-base"
              >
                <span>Explorar Produtos</span>
                <Zap className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </Link>
              <Link
                href="/register"
                className="btn-glass flex items-center gap-2 px-8 py-4 text-base font-semibold text-gray-900"
              >
                <span>Criar Conta Grátis</span>
                <TrendingUp className="h-5 w-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-3 gap-8">
              <div className="glass rounded-2xl p-6">
                <div className="text-4xl font-bold gradient-text">99.9%</div>
                <div className="mt-2 text-sm text-gray-600">Uptime</div>
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="text-4xl font-bold gradient-text">24/7</div>
                <div className="mt-2 text-sm text-gray-600">Suporte</div>
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="text-4xl font-bold gradient-text">100%</div>
                <div className="mt-2 text-sm text-gray-600">Seguro</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Por que escolher a <span className="gradient-text">WbraStore</span>?
            </h2>
            <p className="text-xl text-gray-600">
              Tecnologia de ponta para uma experiência única
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="glass group rounded-3xl p-8 transition-all hover:scale-105">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Ultra Rápido</h3>
              <p className="text-gray-600">
                Performance otimizada com Next.js 16 e edge computing para carregamento instantâneo.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass group rounded-3xl p-8 transition-all hover:scale-105">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">100% Seguro</h3>
              <p className="text-gray-600">
                Pagamentos criptografados com Cielo e autenticação de nível empresarial.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass group rounded-3xl p-8 transition-all hover:scale-105">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Sempre Evoluindo</h3>
              <p className="text-gray-600">
                Atualizações constantes com as últimas tecnologias e tendências do mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-90" />
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Pronto para começar?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Junte-se a milhares de usuários satisfeitos
          </p>
          <Link
            href="/register"
            className="inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-purple-600 shadow-2xl transition-all hover:scale-105"
          >
            Criar Conta Gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>© 2025 WbraStore. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
