export const AlertStatusCode = {
  Success: "success",
  Info: "info",
  Warning: "warning",
  Error: "error",
} as const

export type AlertStatusCode = (typeof AlertStatusCode)[keyof typeof AlertStatusCode]
