import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { TypeMyplaceDetailDefaultId, userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"

export type TypePostMyplaceDetailParams = {
  id: string
  addressName: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

export type TypePostMyplaceDetailResult = null

export type TypeDeleteMyplaceDetailResult = null

export const postMyplaceDetail: TypeFetchList<TypePostMyplaceDetailResult, null, TypePostMyplaceDetailParams> = async (
  key,
  { id, addressName, coordinates },
) => {
  // TODO
  // const token = await getToken()
  // const { data } = await axios.post(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/myplace`,
  //   {
  //     id,
  //     addressName,
  //     coordinates,
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   },
  // )
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_MOCKING_URL}/mocks/user/myplace`,
    {
      id,
      addressName,
      coordinates,
    },
    {
      headers: {
        //
      },
    },
  )
  return data
}

export const deleteMyplaceDetail: TypeFetchList<TypeDeleteMyplaceDetailResult, TypeMyplaceDetailDefaultId> = async (
  id,
) => {
  // TODO
  // const token = await getToken()
  // const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/myplace/${id}`,{
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // })
  const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_API_MOCKING_URL}/mocks/user/myplace/${id}`, {
    headers: {
      //
    },
  })
  return data
}

const useMutationMyplaceDetail = () => {
  const queryClient = useQueryClient()

  const handleOnSuccess = () => {
    queryClient.invalidateQueries({ queryKey: getCacheKey(userKey).myplace.list.toKey() })
  }

  const { mutateAsync: postMyplaceDetailAsync, status: postMyplaceDetailStatus } = useMutation<
    TypePostMyplaceDetailResult,
    AxiosError,
    TypePostMyplaceDetailParams
  >({
    mutationFn: async ({ id, addressName, coordinates }) => {
      const data = await postMyplaceDetail(null, { id, addressName, coordinates })
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
