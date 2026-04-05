export const InputSize = {
  SM: "sm",
  BASE: "base",
  LG: "lg",
} as const

export type InputSize = (typeof InputSize)[keyof typeof InputSize]
