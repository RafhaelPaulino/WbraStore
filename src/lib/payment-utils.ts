import { PaymentStatus as PrismaPaymentStatus } from '@prisma/client'
import { PaymentStatus as CieloPaymentStatus } from '@/types/payment'

/**
 * Mapeia status da Cielo para status do Prisma
 */
export function mapCieloStatusToPrisma(
  cieloStatus: CieloPaymentStatus
): PrismaPaymentStatus {
  const statusMap: Record<CieloPaymentStatus, PrismaPaymentStatus> = {
    NotFinished: 'PENDING',
    Authorized: 'AUTHORIZED',
    PaymentConfirmed: 'PAID',
    Denied: 'DENIED',
    Voided: 'VOIDED',
    Refunded: 'REFUNDED',
    Pending: 'PENDING',
    Aborted: 'ABORTED',
    Scheduled: 'SCHEDULED',
  }

  return statusMap[cieloStatus] || 'PENDING'
}

/**
 * Mapeia status do Prisma para status da ordem
 */
export function mapPaymentStatusToOrderStatus(
  paymentStatus: PrismaPaymentStatus
): 'PENDING' | 'PAYMENT_PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED' {
  switch (paymentStatus) {
    case 'AUTHORIZED':
      return 'PAYMENT_PENDING'
    case 'PAID':
      return 'PAID'
    case 'DENIED':
    case 'VOIDED':
    case 'ABORTED':
      return 'CANCELLED'
    case 'REFUNDED':
    case 'PENDING_REFUND':
      return 'REFUNDED'
    default:
      return 'PENDING'
  }
}
