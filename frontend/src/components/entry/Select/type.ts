export const SelectShape = {
  Square: "square",
  Plain: "plain",
} as const

export type SelectShape = (typeof SelectShape)[keyof typeof SelectShape]
