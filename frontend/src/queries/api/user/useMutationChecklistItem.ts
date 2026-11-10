import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"

export type TypePostChecklistItemParams = {
  checklistId: number
  title: string
  memo?: string
  parentId?: number | null
}

export type TypePatchChecklistItemParams = {
  checklistId: number
  itemId: number
  checked?: boolean
  memo?: string
}

export const postChecklistItem = async (params: TypePostChecklistItemParams) => {
  const token = await getToken()
  const { checklistId, ...body } = params
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/checklists/${checklistId}/item`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return data
}

export const patchChecklistItem = async (params: TypePatchChecklistItemParams) => {
  const token = await getToken()
  const { checklistId, itemId, ...body } = params
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/checklists/${checklistId}/items/${itemId}`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return data
}

const useMutationChecklistItem = () => {
  const queryClient = useQueryClient()

  const invalidateChecklistQueries = () => {
    queryClient.invalidateQueries({
      queryKey: getCacheKey(userKey).checklist.toKey(),
    })
  }

  const { mutateAsync: postChecklistItemAsync, status: postChecklistItemStatus } = useMutation({
    mutationFn: postChecklistItem,
    onSuccess: () => {
      invalidateChecklistQueries()
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 404) {
        alert("체크리스트를 찾을 수 없습니다.")
        return
      }
      if (error.response?.status === 400) {
        alert("제목을 확인해주세요.")
        return
      }
      alert("항목 등록에 실패했습니다.")
    },
  })

  const { mutateAsync: patchChecklistItemAsync, status: patchChecklistItemStatus } = useMutation({
    mutationFn: patchChecklistItem,
    onSuccess: () => {
      invalidateChecklistQueries()
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 404) {
        alert("항목을 찾을 수 없습니다.")
        return
      }
      if (error.response?.status === 400) {
        alert("입력값을 확인해주세요.")
        return
      }
      alert("항목 수정에 실패했습니다.")
    },
  })

  return {
    postChecklistItemAsync,
    postChecklistItemStatus,
    patchChecklistItemAsync,
    patchChecklistItemStatus,
  }
}

export default useMutationChecklistItem
