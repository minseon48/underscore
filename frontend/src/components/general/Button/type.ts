export const ButtonShape = {
  Square: "square",
  Plain: "plain",
} as const

export type ButtonShape = (typeof ButtonShape)[keyof typeof ButtonShape]

export const ButtonSize = {
  SM: "sm",
  BASE: "base",
  LG: "lg",
} as const

export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize]

export const ButtonVariants = {
  Primary: "primary",
  Secondary: "secondary",
} as const

export type ButtonVariants = (typeof ButtonVariants)[keyof typeof ButtonVariants]
