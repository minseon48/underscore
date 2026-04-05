import { TypePaymentPeriodCode, TypePaymentStateCode } from "@/components/form/SearchPayment"

export type TypePaymentListAllId = number
export type TypePaymentListAllFilter = {
  size: number
  paymentStateCode: TypePaymentStateCode
  paymentPeriodCode: TypePaymentPeriodCode
  startDate?: Date
  endDate?: Date
}

export type TypePaymentDetailId = number

export const paymentKey = {
  list: {
    all: (kidId: TypePaymentListAllId, filter: TypePaymentListAllFilter) => [kidId, filter],
  },
  detail: (kidId: TypePaymentDetailId) => [kidId],
}
