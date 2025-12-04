import { NextRequest } from 'next/server'
import { paymentService } from '@/services/payment.service'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { mapCieloStatusToPrisma, mapPaymentStatusToOrderStatus } from '@/lib/payment-utils'
import prisma from '@/lib/prisma'

/**
 * POST /api/webhooks/cielo
 *
 * Webhook para receber notificações de mudanças de status da Cielo
 *
 * A Cielo envia notificações quando:
 * - Status de pagamento muda
 * - Transação é capturada
 * - Transação é cancelada/estornada
 *
 * Formato da notificação:
 * {
 *   "PaymentId": "xxxx-xxxx-xxxx-xxxx",
 *   "ChangeType": 2 // 1=Recorrência, 2=Transação, 3=Boleto
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('[Webhook Cielo] Notificação recebida:', body)

    const paymentId = body.PaymentId
    const changeType = body.ChangeType

    if (!paymentId) {
      console.error('[Webhook Cielo] PaymentId não fornecido')
      return successResponse({ received: true })
    }

    // Buscar pagamento no banco
    const payment = await prisma.payment.findUnique({
      where: { paymentId },
      include: { order: true },
    })

    if (!payment) {
      console.error(`[Webhook Cielo] Pagamento ${paymentId} não encontrado no banco`)
      return successResponse({ received: true })
    }

    // Consultar status atualizado na Cielo
    try {
      const paymentStatus = await paymentService.getPaymentStatus(paymentId)

      console.log('[Webhook Cielo] Status atualizado:', {
        paymentId,
        oldStatus: payment.status,
        newStatus: paymentStatus.status,
      })

      // Mapear status da Cielo para Prisma
      const prismaStatus = mapCieloStatusToPrisma(paymentStatus.status)

      // Atualizar pagamento no banco
      await prisma.payment.update({
        where: { paymentId },
        data: {
          status: prismaStatus,
        },
      })

      // Atualizar status do pedido baseado no status do pagamento
      const newOrderStatus = mapPaymentStatusToOrderStatus(prismaStatus)

      if (newOrderStatus !== payment.order.status) {
        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: newOrderStatus },
        })

        console.log('[Webhook Cielo] Status do pedido atualizado:', {
          orderId: payment.orderId,
          oldStatus: payment.order.status,
          newStatus: newOrderStatus,
        })
      }

      // Aqui você pode adicionar lógica adicional:
      // - Enviar email para o cliente
      // - Notificar admin
      // - Disparar eventos internos
      // - Atualizar estoque (se necessário)

    } catch (error) {
      console.error('[Webhook Cielo] Erro ao consultar status:', error)
      // Não retornar erro para não fazer a Cielo retentar
      // O webhook já foi recebido, o erro é interno
    }

    return successResponse({ received: true })
  } catch (error) {
    console.error('[Webhook Cielo] Erro ao processar webhook:', error)
    return errorResponse(error)
  }
}

/**
 * GET /api/webhooks/cielo
 *
 * Endpoint para verificar se o webhook está funcionando
 */
export async function GET() {
  return successResponse({
    message: 'Webhook Cielo está ativo',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cielo`,
  })
}
