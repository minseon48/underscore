export type TypoSize = typeof typoSize
export type TypoSizeKey = keyof TypoSize
export type TypoLeading = typeof typoLeading
export type TypoLeadingKey = keyof TypoLeading

export const typoSize = {
  xs: "12px", // Footnote
  sm: "14px", // Body
  base: "16px", // H5
  lg: "20px", // H4
  xl: "24px", // H3
  "2xl": "30px", // H2
  "3xl": "38px", // H1
}

export const typoLeading = {
  xs: 1.66, // Footnote
  sm: 1.57, // Body
  base: 1.5, // H5
  lg: 1.4, // H4
  xl: 1.33, // H3
  "2xl": 1.33, // H2
  "3xl": 1.21, // H1
  none: 1,
  tight: 1.21,
  snug: 1.33,
  normal: 1.5,
  relaxed: 1.66,
  loose: 2,
}
