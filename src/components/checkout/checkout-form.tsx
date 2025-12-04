'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cart-store'
import OrderSummary from './order-summary'
import ShippingForm from './shipping-form'
import PaymentForm from './payment-form'

interface CheckoutFormProps {
  userId: string
  userEmail: string
}

type Step = 'shipping' | 'payment' | 'review'

export default function CheckoutForm({ userId, userEmail }: CheckoutFormProps) {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState<Step>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingData, setShippingData] = useState({
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    zipCode: '',
  })

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    holder: '',
    expirationDate: '',
    securityCode: '',
    brand: 'Visa' as const,
    installments: 1,
  })

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
        <button
          onClick={() => router.push('/')}
          className="text-blue-600 hover:text-blue-700"
        >
          Voltar para a loja
        </button>
      </div>
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 15.0 // Valor fixo de frete
  const total = subtotal + shipping

  async function handleSubmit() {
    setIsProcessing(true)

    try {
      // 1. Criar pedido
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: shippingData,
          shipping,
        }),
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || 'Erro ao criar pedido')
      }

      const order = await orderResponse.json()
      const orderId = order.data.id

      // 2. Processar pagamento
      const paymentResponse = await fetch('/api/payment/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          creditCard: {
            cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
            holder: paymentData.holder,
            expirationDate: paymentData.expirationDate,
            securityCode: paymentData.securityCode,
            brand: paymentData.brand,
          },
          installments: paymentData.installments,
          capture: true, // Capturar automaticamente
          customer: {
            name: paymentData.holder,
            email: userEmail,
          },
        }),
      })

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json()
        throw new Error(error.error || 'Erro ao processar pagamento')
      }

      const payment = await paymentResponse.json()

      if (payment.data.authorized || payment.data.captured) {
        // Pagamento aprovado
        clearCart()
        router.push(`/order-success?orderId=${orderId}`)
      } else {
        // Pagamento negado
        alert('Pagamento negado. Verifique os dados do cartão e tente novamente.')
      }
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Erro ao finalizar compra')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulários */}
      <div className="lg:col-span-2 space-y-6">
        {/* Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'shipping'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-600 text-white'
              }`}
            >
              {currentStep === 'shipping' ? '1' : '✓'}
            </div>
            <span className="ml-2 text-sm font-medium">Entrega</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300" />
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'payment'
                  ? 'bg-blue-600 text-white'
                  : currentStep === 'review'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              {currentStep === 'review' ? '✓' : '2'}
            </div>
            <span className="ml-2 text-sm font-medium">Pagamento</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300" />
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              3
            </div>
            <span className="ml-2 text-sm font-medium">Revisão</span>
          </div>
        </div>

        {/* Shipping Form */}
        {currentStep === 'shipping' && (
          <ShippingForm
            data={shippingData}
            onChange={setShippingData}
            onNext={() => setCurrentStep('payment')}
          />
        )}

        {/* Payment Form */}
        {currentStep === 'payment' && (
          <PaymentForm
            data={paymentData}
            onChange={setPaymentData}
            onBack={() => setCurrentStep('shipping')}
            onNext={() => setCurrentStep('review')}
          />
        )}

        {/* Review */}
        {currentStep === 'review' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Revisar Pedido</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Endereço de Entrega</h3>
                <div className="text-sm text-gray-600">
                  <p>
                    {shippingData.street}, {shippingData.number}
                  </p>
                  {shippingData.complement && <p>{shippingData.complement}</p>}
                  <p>
                    {shippingData.district} - {shippingData.city}/{shippingData.state}
                  </p>
                  <p>CEP: {shippingData.zipCode}</p>
                </div>
                <button
                  onClick={() => setCurrentStep('shipping')}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  Alterar
                </button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Forma de Pagamento</h3>
                <div className="text-sm text-gray-600">
                  <p>Cartão de Crédito - {paymentData.brand}</p>
                  <p>Final **** {paymentData.cardNumber.slice(-4)}</p>
                  <p>
                    {paymentData.installments}x de R${' '}
                    {(total / paymentData.installments).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep('payment')}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  Alterar
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setCurrentStep('payment')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </div>
  )
}
