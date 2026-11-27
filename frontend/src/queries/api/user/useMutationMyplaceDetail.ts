import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { TypeMyplaceDetailDefaultId, userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"

export type TypePostMyplaceDetailParams = {
  groupId: number
  id: string
  addressName: string
  coordinates: {
    latitude: number
    longitude: number
  }
  memo?: string
}

export type TypePostMyplaceDetailResult = null

export type TypeDeleteMyplaceDetailResult = null

export const postMyplaceDetail: TypeFetchList<TypePostMyplaceDetailResult, null, TypePostMyplaceDetailParams> = async (
  key,
  { groupId, id, addressName, coordinates, memo },
) => {
  const token = await getToken()
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/myplace`,
    {
      groupId,
      id,
      addressName,
      coordinates,
      memo,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return data
}

export const deleteMyplaceDetail: TypeFetchList<TypeDeleteMyplaceDetailResult, TypeMyplaceDetailDefaultId> = async (
  id,
) => {
  const token = await getToken()
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/myplace/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const useMutationMyplaceDetail = () => {
  const queryClient = useQueryClient()

  const handleOnSuccess = () => {
    queryClient.invalidateQueries({ queryKey: getCacheKey(userKey).myplace.list.toKey() })
    queryClient.invalidateQueries({ queryKey: getCacheKey(userKey).myplace.group.list.toKey() })
  }

  const { mutateAsync: postMyplaceDetailAsync, status: postMyplaceDetailStatus } = useMutation<
    TypePostMyplaceDetailResult,
    AxiosError,
    TypePostMyplaceDetailParams
  >({
    mutationFn: async ({ groupId, id, addressName, coordinates, memo }) => {
      const data = await postMyplaceDetail(null, { groupId, id, addressName, coordinates, memo })
      return data
    },
    onSuccess: () => {
      handleOnSuccess()
    },
    onError: (error) => {
      // TODO
      alert("등록 실패!")
      console.error(error)
    },
  })

  // delete
  const { mutateAsync: deleteMyplaceDetailAsync, status: deleteMyplaceDetailStatus } = useMutation<
    TypeDeleteMyplaceDetailResult,
    AxiosError,
    { id: TypeMyplaceDetailDefaultId }
  >({
    mutationFn: async ({ id }) => {
      const data = await deleteMyplaceDetail(id, {})
      return data
    },
    onSuccess: () => {
      handleOnSuccess()
    },
    onError: (error) => {
      // TODO
      alert("삭제 실패!")
      console.error(error)
    },
  })

  return {
    postMyplaceDetailAsync,
    postMyplaceDetailStatus,
    deleteMyplaceDetailAsync,
    deleteMyplaceDetailStatus,
  }
}

export default useMutationMyplaceDetail
