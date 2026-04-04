export const TypePaymentStateCode = {
  All: "All",
  PaymentScheduled: "PaymentScheduled",
  PaymentCompleted: "PaymentCompleted",
  CancellationComplete: "CancellationComplete",
  PaymentFailed: "PaymentFailed",
} as const

export type TypePaymentStateCode = (typeof TypePaymentStateCode)[keyof typeof TypePaymentStateCode]

export const TypePaymentPeriodCode = {
  ["All"]: "All",
  ["1M"]: "1M",
  ["3M"]: "3M",
  ["6M"]: "6M",
  ["12M"]: "12M",
  ["Custom"]: "custom",
} as const

export type TypePaymentPeriodCode = (typeof TypePaymentPeriodCode)[keyof typeof TypePaymentPeriodCode]

export const PaymentStateOptionGroups = [
  {
    label: "결제상태",
    options: [
      { value: TypePaymentStateCode.All as TypePaymentStateCode, text: "전체" },
      { value: TypePaymentStateCode.PaymentScheduled as TypePaymentStateCode, text: "결제예정" },
      { value: TypePaymentStateCode.PaymentCompleted as TypePaymentStateCode, text: "결제완료" },
      { value: TypePaymentStateCode.CancellationComplete as TypePaymentStateCode, text: "취소완료" },
      { value: TypePaymentStateCode.PaymentFailed as TypePaymentStateCode, text: "결제실패" },
    ],
  },
]

export const PaymentPeriodOptionGroups = [
  {
    label: "조회기간",
    options: [
      { value: TypePaymentPeriodCode["All"] as TypePaymentPeriodCode, text: "전체" },
      { value: TypePaymentPeriodCode["1M"] as TypePaymentPeriodCode, text: "1개월" },
      { value: TypePaymentPeriodCode["3M"] as TypePaymentPeriodCode, text: "3개월" },
      { value: TypePaymentPeriodCode["6M"] as TypePaymentPeriodCode, text: "6개월" },
      { value: TypePaymentPeriodCode["12M"] as TypePaymentPeriodCode, text: "12개월" },
      { value: TypePaymentPeriodCode["Custom"] as TypePaymentPeriodCode, text: "직접입력" },
    ],
  },
]