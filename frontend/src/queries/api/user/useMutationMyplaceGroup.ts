import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { TypeSearchMyplaceGroupResult } from "@/queries/api/user/useSearchMyplaceGroupList"

export type TypePostMyplaceGroupParams = {
  name: string
}

export type TypePostMyplaceGroupResult = TypeSearchMyplaceGroupResult[number]

export type TypeDeleteMyplaceGroupParams = {
  id: number
}

export type TypeDeleteMyplaceGroupResult = null

export const postMyplaceGroup = async ({
  name,
}: TypePostMyplaceGroupParams): Promise<TypePostMyplaceGroupResult> => {
  const token = await getToken()
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/myplace/groups`,
    { name },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return data
}

export const deleteMyplaceGroup = async ({
  id,
}: TypeDeleteMyplaceGroupParams): Promise<TypeDeleteMyplaceGroupResult> => {
  const token = await getToken()
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/myplace/groups/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const useMutationMyplaceGroup = () => {
  const queryClient = useQueryClient()

  const handleOnSuccess = () => {
    queryClient.invalidateQueries({ queryKey: getCacheKey(userKey).myplace.group.list.toKey() })
    queryClient.invalidateQueries({ queryKey: getCacheKey(userKey).myplace.list.toKey() })
  }

  const { mutateAsync: postMyplaceGroupAsync, status: postMyplaceGroupStatus } = useMutation<
    TypePostMyplaceGroupResult,
    AxiosError,
    TypePostMyplaceGroupParams
  >({
    mutationFn: async ({ name }) => {
      const data = await postMyplaceGroup({ name })
      return data
    },
    onSuccess: () => {
      handleOnSuccess()
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        alert("이미 존재하는 그룹 이름입니다.")
        return
      }
      if (error.response?.status === 400) {
        alert("그룹 이름을 확인해주세요.")
        return
      }
      alert("그룹 추가에 실패했습니다.")
      console.error(error)
    },
  })

  const { mutateAsync: deleteMyplaceGroupAsync, status: deleteMyplaceGroupStatus } = useMutation<
    TypeDeleteMyplaceGroupResult,
    AxiosError,
    TypeDeleteMyplaceGroupParams
  >({
    mutationFn: async ({ id }) => {
      const data = await deleteMyplaceGroup({ id })
      return data
    },
    onSuccess: () => {
      handleOnSuccess()
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        alert("기본 그룹은 삭제할 수 없습니다.")
        return
      }
      if (error.response?.status === 404) {
        alert("그룹을 찾을 수 없습니다.")
        return
      }
      alert("그룹 삭제에 실패했습니다.")
      console.error(error)
    },
  })

  return {
    postMyplaceGroupAsync,
    postMyplaceGroupStatus,
    deleteMyplaceGroupAsync,
    deleteMyplaceGroupStatus,
  }
}

export default useMutationMyplaceGroup
