'use client'

interface PaymentFormProps {
  data: {
    cardNumber: string
    holder: string
    expirationDate: string
    securityCode: string
    brand: string
    installments: number
  }
  onChange: (data: any) => void
  onBack: () => void
  onNext: () => void
}

export default function PaymentForm({ data, onChange, onBack, onNext }: PaymentFormProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target

    let formattedValue = value

    // Formatar número do cartão
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19)
    }

    // Formatar data de expiração
    if (name === 'expirationDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 7)
    }

    // Limitar CVV
    if (name === 'securityCode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4)
    }

    onChange({ ...data, [name]: name === 'installments' ? Number(value) : formattedValue })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Pagamento</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Número do Cartão *
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={data.cardNumber}
            onChange={handleChange}
            required
            placeholder="0000 0000 0000 0000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="holder" className="block text-sm font-medium text-gray-700 mb-1">
            Nome no Cartão *
          </label>
          <input
            type="text"
            id="holder"
            name="holder"
            value={data.holder}
            onChange={handleChange}
            required
            placeholder="NOME COMO ESTÁ NO CARTÃO"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
              Validade *
            </label>
            <input
              type="text"
              id="expirationDate"
              name="expirationDate"
              value={data.expirationDate}
              onChange={handleChange}
              required
              placeholder="MM/AAAA"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700 mb-1">
              CVV *
            </label>
            <input
              type="text"
              id="securityCode"
              name="securityCode"
              value={data.securityCode}
              onChange={handleChange}
              required
              placeholder="123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Bandeira *
          </label>
          <select
            id="brand"
            name="brand"
            value={data.brand}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Visa">Visa</option>
            <option value="Master">Mastercard</option>
            <option value="Amex">American Express</option>
            <option value="Elo">Elo</option>
            <option value="Hipercard">Hipercard</option>
            <option value="Diners">Diners</option>
          </select>
        </div>

        <div>
          <label htmlFor="installments" className="block text-sm font-medium text-gray-700 mb-1">
            Parcelas *
          </label>
          <select
            id="installments"
            name="installments"
            value={data.installments}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <option key={n} value={n}>
                {n}x sem juros
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    </form>
  )
}
