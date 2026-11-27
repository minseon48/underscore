export const checklistKey = {
  list: undefined as undefined,
  detail: (checklistId: number) => [checklistId],
  section: (checklistId: number, sectionId: number) => [checklistId, "section", sectionId],
}

export type TypeSectionCard = {
  id: number
  title: string
  sortOrder: number
  totalTaskCount: number
  checkedTaskCount: number
  progressPercent: number
}

export type TypeChecklistOverview = {
  id: number
  title: string
  memo?: string | null
  groupId: number
  groupName: string
  progressPercent: number
  sections: TypeSectionCard[]
}

export type TypeChecklistItem = {
  id: number
  parentId: number | null
  title: string
  memo: string | null
  checked: boolean
  sortOrder: number
}

export type TypeSectionDetail = {
  section: TypeSectionCard
  items: TypeChecklistItem[]
}

export type TypeChecklistItemDraft = {
  clientId: string
  parentClientId: string | null
  title: string
  memo?: string
  sortOrder: number
}
