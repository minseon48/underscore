export const LabelNecessity = {
  Icon: "icon",
  Text: "text",
} as const

export type LabelNecessity = (typeof LabelNecessity)[keyof typeof LabelNecessity]
