import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"

export type TypePostProfileParams = {
  name: string
  email: string
}

export type TypePostProfileResult = null

export const postProfile: TypeFetchList<TypePostProfileResult, null, TypePostProfileParams> = async (
  key,
  { name, email },
) => {
  const token = await getToken()
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
    {
      name,
      email,
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

const useMutationProfile = () => {
  const queryClient = useQueryClient()

  const handleOnSuccess = () => {
    queryClient.invalidateQueries({ queryKey: getCacheKey(userKey).profile.default.toKey() })
  }

  const { mutateAsync: postProfileAsync, status: postProfileStatus } = useMutation<
    TypePostProfileResult,
    AxiosError,
    TypePostProfileParams
  >({
    mutationFn: async ({ name, email }) => {
      const data = await postProfile(null, { name, email })
      return data
    },
    onSuccess: () => {
      handleOnSuccess()
    },
    onError: (error) => {
      // TODO
      alert("저장 실패!")
      console.error(error)
    },
  })

  return {
    postProfileAsync,
    postProfileStatus,
  }
}

export default useMutationProfile
