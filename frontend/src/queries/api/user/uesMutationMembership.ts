import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"

export type TypePostMembershipParams = {
  subscriptionCode: string
}

export type TypePostMembershipResult = null

export const postMembership: TypeFetchList<TypePostMembershipResult, null, TypePostMembershipParams> = async (
  key,
  { subscriptionCode },
) => {
  // TODO
  // const token = await getToken()
  // const { data } = await axios.post(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/membership`,
  //   {
  //     subscriptionCode
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   },
  // )
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_MOCKING_URL}/mocks/user/membership`,
    {
      subscriptionCode,
    },
    {
      headers: {
        //
      },
    },
  )
  return data
}

const useMutationMembership = () => {
  const queryClient = useQueryClient()

  const handleOnSuccess = () => {
    queryClient.invalidateQueries({ queryKey: getCacheKey(userKey).profile.default.toKey() })
    queryClient.invalidateQueries({ queryKey: getCacheKey(userKey).membership.default.toKey() })
  }

  const { mutateAsync: postMembershipAsync, status: postMembershipStatus } = useMutation<
    TypePostMembershipResult,
    AxiosError,
    TypePostMembershipParams
  >({
    mutationFn: async ({ subscriptionCode }) => {
      const data = await postMembership(null, { subscriptionCode })
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
    postMembershipAsync,
    postMembershipStatus,
  }
}

export default useMutationMembership
