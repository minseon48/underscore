export type TypeAnalysisListAllId = number
export type TypeAnalysisListAllFilter = {
  level: number
  businessCode: string
  searchBounds: [number, number, number, number]
}

export type TypeAnalysisReportFilter = {
    administrativeCode: string
    businessCode: string
    }

export const analysisMapKey = {
  list: {
    all: (kidId: TypeAnalysisListAllId, filter: TypeAnalysisListAllFilter) => [kidId, filter],
  },
  report: {
      detail: (administrativeCode: string, businessCode: string) =>
      [administrativeCode, businessCode]
      }
}
