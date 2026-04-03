export const PictureRounded = {
  NONE: "none",
  FULL: "full",
} as const

export type PictureRounded = (typeof PictureRounded)[keyof typeof PictureRounded]
