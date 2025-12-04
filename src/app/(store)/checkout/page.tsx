import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import CheckoutForm from '@/components/checkout/checkout-form'

export default async function CheckoutPage() {
  const session = await auth()

  if (!session) {
    redirect('/login?callbackUrl=/checkout')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
      <CheckoutForm userId={session.user.id} userEmail={session.user.email || ''} />
    </div>
  )
}
