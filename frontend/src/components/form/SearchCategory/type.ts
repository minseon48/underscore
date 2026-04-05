export const TypeCategoryCode = {
  FD6: "FD6",
  CE7: "CE7",
  CS2: "CS2",
  PK6: "PK6",
} as const

export type TypeCategoryCode = (typeof TypeCategoryCode)[keyof typeof TypeCategoryCode]

export const CategoryOptionGroups = [
  {
    label: "카테고리 선택",
    options: [
      { value: TypeCategoryCode.FD6 as TypeCategoryCode, text: "음식점" },
      { value: TypeCategoryCode.CE7 as TypeCategoryCode, text: "카페" },
      { value: TypeCategoryCode.CS2 as TypeCategoryCode, text: "편의점" },
      { value: TypeCategoryCode.PK6 as TypeCategoryCode, text: "주차장" },
    ],
  },
]
