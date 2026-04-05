export const PanelViewSubjectStatusCode = {
  Loading: "loading",
  Warning: "warning",
  Success: "success",
} as const

export type PanelViewSubjectStatusCode = (typeof PanelViewSubjectStatusCode)[keyof typeof PanelViewSubjectStatusCode]
