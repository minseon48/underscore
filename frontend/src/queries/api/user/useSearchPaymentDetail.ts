import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { TypePaymentDetailId, userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"
import { TypeSubscriptionCode } from "@/components/form/ChangeMembership/type"
import { TypePaymentStateCode } from "@/components/form/SearchPayment/type"

export type TypeSearchPaymentDetailResult = {
  id: number
  subscriptionCode: TypeSubscriptionCode
  effectiveDate: Date
  expirationDate: Date
  paymentMethod: string
  paymentInfo: string
  paymentState: TypePaymentStateCode
  paymentAmount: number
  paymentDate: Date
  billingDate: Date
  errorCode?: string
  errorMessage?: string
}

export const fetchSearchPaymentDetail: TypeFetchList<TypeSearchPaymentDetailResult, TypePaymentDetailId> = async (
  id,
) => {
  // TODO
  // const token = await getToken()
  // const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/${id}`, {
  //   params: {
  //
  //   },
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // })
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_MOCKING_URL}/mocks/user/payment/${id}`, {
    params: {
      //
    },
  })
  return data
}

const useSearchPaymentDetail = (id: TypePaymentDetailId) => {
  const context = useQuery({
    queryKey: getCacheKey(userKey).payment.detail.toKeyWithArgs(id),
    queryFn: async () => {
      const data = await fetchSearchPaymentDetail(id, {})
      return data
    },
  })

  return {
    ...context,
  }
}

export default useSearchPaymentDetail
