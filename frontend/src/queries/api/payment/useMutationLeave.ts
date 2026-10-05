import axios, { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"

export type TypeLeaveResult = {
    paymentId: number
}

export const postLeaveMembership = async (cancelReason: string): Promise<TypeLeaveResult> => {
  const token = await getToken()
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/payment/leave`,
    { cancelReason },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return data
}

const useMutationLeave = () => {
  const queryClient = useQueryClient()

  const handleOnSuccess = () => {
    queryClient.invalidateQueries({
        queryKey: getCacheKey(userKey).payment.list.toKey(),
    })
  }

  const { mutateAsync: postLeaveAsync, status: postLeaveStatus } = useMutation<
    TypeLeaveResult,
    AxiosError,
    { cancelReason: string }
  >({
    mutationFn: ({ cancelReason }) => postLeaveMembership(cancelReason),
    onSuccess: handleOnSuccess,
    onError: (error) => {
      alert("이용권 종료에 실패했습니다.")
      console.error(error)
    },
  })

  return { postLeaveAsync, postLeaveStatus }
}

export default useMutationLeave
