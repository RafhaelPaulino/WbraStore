import { NextRequest } from 'next/server'
import { z } from 'zod'
import { paymentService } from '@/services/payment.service'
import {
  successResponse,
  errorResponse,
  requireAuth,
  ApiError,
} from '@/lib/api-utils'
import { mapCieloStatusToPrisma } from '@/lib/payment-utils'
import prisma from '@/lib/prisma'

const cancelPaymentSchema = z.object({
  paymentId: z.string().min(1, 'ID de pagamento é obrigatório'),
  amount: z.number().positive().optional(), // em reais (opcional, se não informado cancela total)
})

/**
 * POST /api/payment/cancel
 *
 * Cancela/estorna um pagamento
 * - Se não capturado: cancela a autorização
 * - Se já capturado: faz estorno (total ou parcial)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const validatedData = cancelPaymentSchema.parse(body)

    // Buscar pagamento no banco
    const payment = await prisma.payment.findUnique({
      where: { paymentId: validatedData.paymentId },
      include: { order: true },
    })

    if (!payment) {
      throw new ApiError('Pagamento não encontrado', 404)
    }

    // Verificar permissão (apenas admin ou dono do pedido)
    if (session.user.role !== 'ADMIN' && payment.order.userId !== session.user.id) {
      throw new ApiError('Você não tem permissão para cancelar este pagamento', 403)
    }

    // Validar status do pagamento
    if (!['Authorized', 'PaymentConfirmed'].includes(payment.status)) {
      throw new ApiError('Este pagamento não pode ser cancelado', 400)
    }

    // Converter valor para centavos se informado
    const amountInCents = validatedData.amount
      ? Math.round(validatedData.amount * 100)
      : undefined

    // Cancelar pagamento
    const paymentResponse = await paymentService.cancel({
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

    // Atualizar status do pedido para CANCELLED ou REFUNDED
    const newOrderStatus = payment.status === 'AUTHORIZED' ? 'CANCELLED' : 'REFUNDED'
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: newOrderStatus },
    })

    return successResponse({
      paymentId: paymentResponse.paymentId,
      status: paymentResponse.status,
      cancelled: true,
      message: payment.status === 'AUTHORIZED'
        ? 'Autorização cancelada com sucesso'
        : 'Pagamento estornado com sucesso',
    })
  } catch (error) {
    return errorResponse(error)
  }
}
