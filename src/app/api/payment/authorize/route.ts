import { NextRequest } from 'next/server'
import { z } from 'zod'
import { paymentService } from '@/services/payment.service'
import { OrderService } from '@/application/services/OrderService'
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository'
import { CartRepository } from '@/infrastructure/repositories/CartRepository'
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository'
import {
  successResponse,
  errorResponse,
  requireAuth,
  ApiError,
} from '@/lib/api-utils'
import { mapCieloStatusToPrisma, mapPaymentStatusToOrderStatus } from '@/lib/payment-utils'
import prisma from '@/lib/prisma'

const orderRepository = new OrderRepository()
const cartRepository = new CartRepository()
const productRepository = new ProductRepository()
const orderService = new OrderService(orderRepository, cartRepository, productRepository)

const authorizePaymentSchema = z.object({
  orderId: z.string().cuid('ID de pedido inválido'),
  creditCard: z.object({
    cardNumber: z.string().length(16, 'Número do cartão deve ter 16 dígitos'),
    holder: z.string().min(3, 'Nome do titular é obrigatório'),
    expirationDate: z.string().regex(/^\d{2}\/\d{4}$/, 'Data deve estar no formato MM/YYYY'),
    securityCode: z.string().min(3).max(4, 'CVV inválido'),
    brand: z.enum(['Visa', 'Master', 'Amex', 'Elo', 'Aura', 'JCB', 'Diners', 'Discover', 'Hipercard']),
  }),
  installments: z.number().int().min(1).max(12).default(1),
  capture: z.boolean().default(false), // false = apenas autoriza, true = autoriza e captura
  customer: z
    .object({
      name: z.string(),
      email: z.string().email().optional(),
      identity: z.string().optional(),
      identityType: z.enum(['CPF', 'CNPJ']).optional(),
    })
    .optional(),
})

/**
 * POST /api/payment/authorize
 *
 * Autoriza um pagamento com cartão de crédito
 * - Se capture=false: apenas autoriza (precisa capturar depois)
 * - Se capture=true: autoriza e captura automaticamente
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const validatedData = authorizePaymentSchema.parse(body)

    // Buscar pedido
    const order = await orderService.getOrderById(validatedData.orderId)

    // Verificar se o pedido pertence ao usuário (ou se é admin)
    if (session.user.role !== 'ADMIN' && order.userId !== session.user.id) {
      throw new ApiError('Você não tem permissão para pagar este pedido', 403)
    }

    // Verificar se pedido já foi pago
    if (order.status !== 'PENDING' && order.status !== 'PAYMENT_PENDING') {
      throw new ApiError('Este pedido não pode ser pago', 400)
    }

    // Converter valor para centavos (Cielo trabalha com centavos)
    const amountInCents = Math.round(Number(order.total) * 100)

    // Autorizar pagamento
    const paymentResponse = await paymentService.authorize({
      orderId: order.id,
      amount: amountInCents,
      installments: validatedData.installments,
      capture: validatedData.capture,
      softDescriptor: 'WbraStore',
      creditCard: validatedData.creditCard,
      customer: validatedData.customer,
    })

    // Mapear status da Cielo para Prisma
    const prismaStatus = mapCieloStatusToPrisma(paymentResponse.status)

    // Atualizar pedido com informações do pagamento
    await prisma.payment.create({
      data: {
        orderId: order.id,
        paymentId: paymentResponse.paymentId,
        amount: order.total,
        status: prismaStatus,
        method: 'CREDIT_CARD',
        authorizationCode: paymentResponse.authorizationCode,
        tid: paymentResponse.tid,
        proofOfSale: paymentResponse.proofOfSale,
        returnCode: paymentResponse.returnCode,
        returnMessage: paymentResponse.returnMessage,
        cardBrand: validatedData.creditCard.brand,
      },
    })

    // Atualizar status do pedido baseado no status do pagamento
    const newOrderStatus = mapPaymentStatusToOrderStatus(prismaStatus)

    await orderService.updateOrderStatus({
      orderId: order.id,
      status: newOrderStatus,
    })

    return successResponse({
      paymentId: paymentResponse.paymentId,
      status: paymentResponse.status,
      authorized: paymentResponse.status === 'Authorized' || paymentResponse.status === 'PaymentConfirmed',
      captured: paymentResponse.status === 'PaymentConfirmed',
      message:
        paymentResponse.status === 'Authorized'
          ? 'Pagamento autorizado com sucesso'
          : paymentResponse.status === 'PaymentConfirmed'
            ? 'Pagamento confirmado com sucesso'
            : 'Pagamento negado',
    })
  } catch (error) {
    return errorResponse(error)
  }
}
