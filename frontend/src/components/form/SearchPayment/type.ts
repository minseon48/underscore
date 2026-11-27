import { FieldValues } from "react-hook-form"

export const TypePaymentStateCode = {
  All: "All",
  PaymentScheduled: "PaymentScheduled",
  PaymentCompleted: "PaymentCompleted",
  CancellationComplete: "CancellationComplete",
  PaymentFailed: "PaymentFailed",
} as const

export type TypePaymentStateCode = (typeof TypePaymentStateCode)[keyof typeof TypePaymentStateCode]

export const PaymentStateOptionGroups = [
  {
    label: "결제상태",
    options: [
      { value: TypePaymentStateCode.All as TypePaymentStateCode, text: "전체" },
      { value: TypePaymentStateCode.PaymentCompleted as TypePaymentStateCode, text: "결제완료" },
      { value: TypePaymentStateCode.CancellationComplete as TypePaymentStateCode, text: "취소완료" },
      { value: TypePaymentStateCode.PaymentFailed as TypePaymentStateCode, text: "결제실패" },
    ],
  },
]

export interface TypeSearchPayment extends FieldValues {
  page: number
  size: number
  isFiltered: boolean
  paymentStateCode: TypePaymentStateCode
  startDate?: Date
  endDate?: Date
  searchPaymentStateCode: TypePaymentStateCode
  searchStartDate?: Date
  searchEndDate?: Date
}
