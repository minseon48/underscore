import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import {
  TypeChecklistItemDraft,
  TypeSectionCard,
  TypeSectionDetail,
} from "@/queries/api/user/checklist/type"

export const postSection = async (checklistId: number, title: string) => {
  const token = await getToken()
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/checklists/${checklistId}/sections`,
    { title },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return data as TypeSectionCard
}

export const putSectionItems = async (params: {
  checklistId: number
  sectionId: number
  items: TypeChecklistItemDraft[]
}) => {
  const token = await getToken()
  const { checklistId, sectionId, items } = params
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/checklists/${checklistId}/sections/${sectionId}/items`,
    { items },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return data as TypeSectionDetail
}

const useMutationSection = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: postSectionAsync, status: postSectionStatus } = useMutation({
    mutationFn: ({ checklistId, title }: { checklistId: number; title: string }) =>
      postSection(checklistId, title),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: getCacheKey(userKey).checklist.detail.toKeyWithArgs(variables.checklistId),
      })
    },
    onError: () => {
      alert("영역 추가에 실패했습니다.")
    },
  })

  const { mutateAsync: putSectionItemsAsync, status: putSectionItemsStatus } = useMutation({
    mutationFn: putSectionItems,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: getCacheKey(userKey).checklist.detail.toKeyWithArgs(variables.checklistId),
      })
      queryClient.invalidateQueries({
        queryKey: getCacheKey(userKey).checklist.section.toKeyWithArgs(
          variables.checklistId,
          variables.sectionId,
        ),
      })
    },
    onError: (_error: AxiosError) => {
      alert("항목 저장에 실패했습니다.")
    },
  })

  return {
    postSectionAsync,
    postSectionStatus,
    putSectionItemsAsync,
    putSectionItemsStatus,
  }
}

export default useMutationSection
