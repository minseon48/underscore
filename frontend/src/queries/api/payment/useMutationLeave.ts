import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"

export const postLeaveMembership = async (): Promise<void> => {
  const token = await getToken()
  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/leave`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

const useMutationLeave = () => {
  const queryClient = useQueryClient()

  const handleOnSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: getCacheKey(userKey).membership.default.toKey(),
    })
    queryClient.invalidateQueries({
      queryKey: getCacheKey(userKey).profile.default.toKey(),
    })
  }

  const { mutateAsync: postLeaveAsync, status: postLeaveStatus } = useMutation<void, AxiosError, void>({
    mutationFn: postLeaveMembership,
    onSuccess: handleOnSuccess,
    onError: (error) => {
      alert("이용권 종료에 실패했습니다.")
      console.error(error)
    },
  })

  return { postLeaveAsync, postLeaveStatus }
}

export default useMutationLeave
