// Tipos para integração Cielo E-Commerce 3.0

export interface CreditCardData {
  cardNumber: string
  holder: string
  expirationDate: string // MM/YYYY
  securityCode: string
  brand: 'Visa' | 'Master' | 'Amex' | 'Elo' | 'Aura' | 'JCB' | 'Diners' | 'Discover' | 'Hipercard'
}

export interface CustomerData {
  name: string
  email?: string
  identity?: string // CPF/CNPJ
  identityType?: 'CPF' | 'CNPJ'
  mobile?: string
}

export interface AddressData {
  street: string
  number: string
  complement?: string
  zipCode: string
  city: string
  state: string
  country: string
  district?: string
}

export interface PaymentRequest {
  orderId: string
  amount: number // em centavos
  currency?: string
  installments?: number
  capture?: boolean
  softDescriptor?: string
  creditCard: CreditCardData
  customer?: CustomerData
  shipping?: {
    address: AddressData
  }
  billing?: {
    address: AddressData
  }
}

export interface CieloPaymentResponse {
  paymentId: string
  status: PaymentStatus
  returnCode?: string
  returnMessage?: string
  proofOfSale?: string
  authorizationCode?: string
  tid?: string // Transaction ID
  nsu?: string
  amount: number
  capturedAmount?: number
  capturedDate?: string
  voidedAmount?: number
  voidedDate?: string
}

export type PaymentStatus =
  | 'NotFinished'
  | 'Authorized'
  | 'PaymentConfirmed'
  | 'Denied'
  | 'Voided'
  | 'Refunded'
  | 'Pending'
  | 'Aborted'
  | 'Scheduled'

export interface CaptureRequest {
  paymentId: string
  amount?: number // em centavos (opcional, se não informado captura total)
}

export interface CancelRequest {
  paymentId: string
  amount?: number // em centavos (opcional, se não informado cancela total)
}

export interface WebhookNotification {
  paymentId: string
  changeType: number // 1=Recorrência, 2=Transação, 3=Boleto
  recurrentPaymentId?: string
}

export interface PaymentError {
  code: string
  message: string
  details?: unknown
}
