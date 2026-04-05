export const TypeSubscriptionCode = {
  Free: "free",
  Month: "month",
  Year: "year",
} as const

export type TypeSubscriptionCode = (typeof TypeSubscriptionCode)[keyof typeof TypeSubscriptionCode]

export const MembershipOptionGroups = [
  {
    label: "membership",
    options: [
      { value: TypeSubscriptionCode.Free as TypeSubscriptionCode, text: "무료 이용권", description: "0원/월" },
      { value: TypeSubscriptionCode.Month as TypeSubscriptionCode, text: "월간 이용권", description: "9,900원/월" },
      {
        value: TypeSubscriptionCode.Year as TypeSubscriptionCode,
        text: "연간 이용권",
        description: "106,800원/연",
      },
    ],
  },
]
