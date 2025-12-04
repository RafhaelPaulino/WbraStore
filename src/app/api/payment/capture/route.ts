import { NextRequest } from 'next/server'
import { z } from 'zod'
import { paymentService } from '@/services/payment.service'
import {
  successResponse,
  errorResponse,
  requireAdmin,
  ApiError,
} from '@/lib/api-utils'
import { mapCieloStatusToPrisma } from '@/lib/payment-utils'
import prisma from '@/lib/prisma'

const capturePaymentSchema = z.object({
  paymentId: z.string().min(1, 'ID de pagamento é obrigatório'),
  amount: z.number().positive().optional(), // em reais (opcional, se não informado captura total)
})

/**
 * POST /api/payment/capture
 *
 * Captura um pagamento previamente autorizado
 * Apenas admin pode fazer captura manual
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = capturePaymentSchema.parse(body)

    // Buscar pagamento no banco
    const payment = await prisma.payment.findUnique({
      where: { paymentId: validatedData.paymentId },
      include: { order: true },
    })

    if (!payment) {
      throw new ApiError('Pagamento não encontrado', 404)
    }

    if (payment.status !== 'AUTHORIZED') {
      throw new ApiError('Apenas pagamentos autorizados podem ser capturados', 400)
    }

    // Converter valor para centavos se informado
    const amountInCents = validatedData.amount
      ? Math.round(validatedData.amount * 100)
      : undefined

    // Capturar pagamento
    const paymentResponse = await paymentService.capture({
      paymentId: validatedData.paymentId,
      amount: amountInCents,
    })

    // Mapear status da Cielo para Prisma
    const prismaStatus = mapCieloStatusToPrisma(paymentResponse.status)

    // Atualizar pagamento no banco
    await prisma.payment.update({
      where: { paymentId: validatedData.paymentId },
      data: {
        status: prismaStatus,
      },
    })

    // Atualizar status do pedido para PAID se confirmado
    if (prismaStatus === 'PAID') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID' },
      })
    }

    return successResponse({
      paymentId: paymentResponse.paymentId,
      status: paymentResponse.status,
      captured: paymentResponse.status === 'PaymentConfirmed',
      capturedAmount: paymentResponse.capturedAmount
        ? paymentResponse.capturedAmount / 100
        : null,
      message: 'Pagamento capturado com sucesso',
    })
  } catch (error) {
    return errorResponse(error)
  }
}
