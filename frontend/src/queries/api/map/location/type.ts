export type TypeLocationListAllId = number
export type TypeLocationListAllFilter = {
  searchKeyword: string
}

export const locationMapKey = {
  list: {
    all: (kidId: TypeLocationListAllId, filter: TypeLocationListAllFilter) => [kidId, filter],
  },
}
