export const HelperVariants = {
  Default: "default",
  Error: "error",
} as const

export type HelperVariants = (typeof HelperVariants)[keyof typeof HelperVariants]
