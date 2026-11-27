import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { TypeChecklistOverview } from "@/queries/api/user/checklist/type"

export type TypePostChecklistParams = {
  groupId: number
  title: string
  memo?: string
}

export type TypePostChecklistResult = TypeChecklistOverview

export const postChecklist = async (
  params: TypePostChecklistParams,
): Promise<TypePostChecklistResult> => {
  const token = await getToken()
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/checklists`, params, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

export const deleteChecklist = async (checklistId: number) => {
    const token = await getToken()
    await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/checklists/${checklistId}`,
        { headers: { Authorization: `Bearer ${token}`} },
        )
    }

const useMutationChecklist = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: postChecklistAsync, status: postChecklistStatus } = useMutation<
    TypePostChecklistResult,
    AxiosError,
    TypePostChecklistParams
  >({
    mutationFn: postChecklist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getCacheKey(userKey).checklist.list.toKey(),
      })
    },
    onError: (error) => {
      if (error.response?.status === 404) {
        alert("그룹을 찾을 수 없습니다.")
        return
      }
      if (error.response?.status === 400) {
        alert("입력값을 확인해주세요.")
        return
      }
      alert("체크리스트 생성에 실패했습니다.")
    },
  })

const { mutateAsync: deleteChecklistAsync, status: deleteChecklistStatus } = useMutation({
    mutationFn: deleteChecklist,
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: getCacheKey(userKey).checklist.toKey(),
            })
        },
    onError: (error: AxiosError) => {
        if(error.response?.status === 404){
            alert("체크리스트를 찾을 수 없습니다.")
            return
            }
        alert("체크리스트 삭제에 실패했습니다.")
        },
    })

  return { postChecklistAsync, postChecklistStatus,
           deleteChecklistAsync, deleteChecklistStatus,}
}

export default useMutationChecklist
