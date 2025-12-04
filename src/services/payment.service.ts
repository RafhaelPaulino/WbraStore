import {
  PaymentRequest,
  CieloPaymentResponse,
  CaptureRequest,
  CancelRequest,
  PaymentError,
} from '@/types/payment'

/**
 * PaymentService - Serviço para integração com Cielo E-Commerce 3.0
 *
 * Responsável por:
 * - Autorização de pagamentos
 * - Captura de valores autorizados
 * - Cancelamento/estorno de transações
 * - Consulta de status
 */
export class PaymentService {
  private merchantId: string
  private merchantKey: string
  private apiUrl: string
  private apiQueryUrl: string
  private sandbox: boolean

  constructor() {
    this.merchantId = process.env.CIELO_MERCHANT_ID || ''
    this.merchantKey = process.env.CIELO_MERCHANT_KEY || ''
    this.sandbox = process.env.CIELO_SANDBOX === 'true'

    // URLs da API Cielo
    this.apiUrl = this.sandbox
      ? 'https://apisandbox.cieloecommerce.cielo.com.br'
      : 'https://api.cieloecommerce.cielo.com.br'

    this.apiQueryUrl = this.sandbox
      ? 'https://apiquerysandbox.cieloecommerce.cielo.com.br'
      : 'https://apiquery.cieloecommerce.cielo.com.br'

    if (!this.merchantId || !this.merchantKey) {
      console.warn(
        'Credenciais Cielo não configuradas. Configure CIELO_MERCHANT_ID e CIELO_MERCHANT_KEY'
      )
    }
  }

  /**
   * Valida se as credenciais estão configuradas
   */
  private validateCredentials() {
    if (!this.merchantId || !this.merchantKey) {
      throw new Error('Credenciais Cielo não configuradas')
    }
  }

  /**
   * Headers padrão para requisições à API Cielo
   */
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      MerchantId: this.merchantId,
      MerchantKey: this.merchantKey,
    }
  }

  /**
   * Autoriza um pagamento (com ou sem captura automática)
   */
  async authorize(request: PaymentRequest): Promise<CieloPaymentResponse> {
    this.validateCredentials()

    try {
      const payload = {
        MerchantOrderId: request.orderId,
        Customer: request.customer
          ? {
              Name: request.customer.name,
              Email: request.customer.email,
              Identity: request.customer.identity,
              IdentityType: request.customer.identityType,
              Mobile: request.customer.mobile,
            }
          : undefined,
        Payment: {
          Type: 'CreditCard',
          Amount: request.amount,
          Currency: request.currency || 'BRL',
          Country: 'BRA',
          Installments: request.installments || 1,
          Capture: request.capture ?? false,
          SoftDescriptor: request.softDescriptor,
          CreditCard: {
            CardNumber: request.creditCard.cardNumber,
            Holder: request.creditCard.holder,
            ExpirationDate: request.creditCard.expirationDate,
            SecurityCode: request.creditCard.securityCode,
            Brand: request.creditCard.brand,
          },
        },
      }

      const response = await fetch(`${this.apiUrl}/1/sales`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw this.handleError(data)
      }

      return this.mapCieloResponse(data)
    } catch (error) {
      console.error('Erro ao autorizar pagamento:', error)
      throw error
    }
  }

  /**
   * Captura um pagamento previamente autorizado
   */
  async capture(request: CaptureRequest): Promise<CieloPaymentResponse> {
    this.validateCredentials()

    try {
      const url = request.amount
        ? `${this.apiUrl}/1/sales/${request.paymentId}/capture?amount=${request.amount}`
        : `${this.apiUrl}/1/sales/${request.paymentId}/capture`

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw this.handleError(data)
      }

      return this.mapCieloResponse(data)
    } catch (error) {
      console.error('Erro ao capturar pagamento:', error)
      throw error
    }
  }

  /**
   * Cancela/estorna um pagamento
   */
  async cancel(request: CancelRequest): Promise<CieloPaymentResponse> {
    this.validateCredentials()

    try {
      const url = request.amount
        ? `${this.apiUrl}/1/sales/${request.paymentId}/void?amount=${request.amount}`
        : `${this.apiUrl}/1/sales/${request.paymentId}/void`

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw this.handleError(data)
      }

      return this.mapCieloResponse(data)
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error)
      throw error
    }
  }

  /**
   * Consulta o status de um pagamento
   */
  async getPaymentStatus(paymentId: string): Promise<CieloPaymentResponse> {
    this.validateCredentials()

    try {
      const response = await fetch(`${this.apiQueryUrl}/1/sales/${paymentId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw this.handleError(data)
      }

      return this.mapCieloResponse(data)
    } catch (error) {
      console.error('Erro ao consultar pagamento:', error)
      throw error
    }
  }

  /**
   * Mapeia resposta da Cielo para o formato interno
   */
  private mapCieloResponse(data: any): CieloPaymentResponse {
    const payment = data.Payment || data

    return {
      paymentId: payment.PaymentId,
      status: this.mapStatus(payment.Status),
      returnCode: payment.ReturnCode,
      returnMessage: payment.ReturnMessage,
      proofOfSale: payment.ProofOfSale,
      authorizationCode: payment.AuthorizationCode,
      tid: payment.Tid,
      nsu: payment.Nsu,
      amount: payment.Amount,
      capturedAmount: payment.CapturedAmount,
      capturedDate: payment.CapturedDate,
      voidedAmount: payment.VoidedAmount,
      voidedDate: payment.VoidedDate,
    }
  }

  /**
   * Mapeia status numérico da Cielo para enum
   */
  private mapStatus(status: number): any {
    const statusMap: Record<number, string> = {
      0: 'NotFinished',
      1: 'Authorized',
      2: 'PaymentConfirmed',
      3: 'Denied',
      10: 'Voided',
      11: 'Refunded',
      12: 'Pending',
      13: 'Aborted',
      20: 'Scheduled',
    }

    return statusMap[status] || 'NotFinished'
  }

  /**
   * Trata erros da API Cielo
   */
  private handleError(data: any): PaymentError {
    const error: PaymentError = {
      code: data[0]?.Code || 'UNKNOWN_ERROR',
      message: data[0]?.Message || 'Erro desconhecido ao processar pagamento',
      details: data,
    }

    return error
  }
}

// Singleton instance
export const paymentService = new PaymentService()
