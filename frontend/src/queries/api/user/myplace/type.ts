export type TypeMyplaceListAllId = number
export type TypeMyplaceListAllFilter = {
  size: number
  groupId: number
}

export type TypeMyplaceDetailDefaultId = number

export const myplaceKey = {
  list: {
    all: (kidId: TypeMyplaceListAllId, filter: TypeMyplaceListAllFilter) => [kidId, filter],
  },
  detail: (kidId: TypeMyplaceDetailDefaultId) => [kidId],
  group: {
      list: undefined,
      },
}
