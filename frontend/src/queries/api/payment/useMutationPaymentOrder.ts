import axios, { AxiosError } from "axios"
import { useMutation } from "@tanstack/react-query"
import { getToken } from "@/libs/cache"

export type TypePostPaymentOrderParams = {
  subscriptionCode: string
}

export type TypePostPaymentOrderResult = {
  orderId: string
  orderName: string
  amount: number
  customerKey: string
}

export const postPaymentOrder = async ({
  subscriptionCode,
}: TypePostPaymentOrderParams): Promise<TypePostPaymentOrderResult> => {
  const token = await getToken()
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/payment/orders`,
    { subscriptionCode },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return data
}

const useMutationPaymentOrder = () => {
  const { mutateAsync: postPaymentOrderAsync, status: postPaymentOrderStatus } = useMutation<
    TypePostPaymentOrderResult,
    AxiosError,
    TypePostPaymentOrderParams
  >({
    mutationFn: postPaymentOrder,
    onError: (error) => {
      alert("주문 생성에 실패했습니다.")
      console.error(error)
    },
  })

  return {
    postPaymentOrderAsync,
    postPaymentOrderStatus,
  }
}

export default useMutationPaymentOrder
