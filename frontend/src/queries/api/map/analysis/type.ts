export type TypeAnalysisListAllId = number
export type TypeAnalysisListAllFilter = {
  level: number
  businessCode: string
  searchBounds: [number, number, number, number]
}

export const analysisMapKey = {
  list: {
    all: (kidId: TypeAnalysisListAllId, filter: TypeAnalysisListAllFilter) => [kidId, filter],
  },
}
