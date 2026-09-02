import axios from "axios"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { TypePaymentListAllId, TypePaymentListAllFilter, userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"
import { TypeSubscriptionCode } from "@/components/form/ChangeMembership/type"
import { TypePaymentStateCode } from "@/components/form/SearchPayment/type"

export type TypeSearchPaymentListResult = {
  count: number
  totalCount: number
  items: {
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
    receiptUrl?: string
  }[]
}

export const fetchSearchPaymentList: TypeFetchList<
  TypeSearchPaymentListResult,
  TypePaymentListAllId,
  TypePaymentListAllFilter
> = async (page, { size, paymentStateCode, startDate, endDate }) => {
  const token = await getToken()
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/history`, {
    params: {
      page,
      size,
      paymentStateCode,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const useSearchPaymentList = (
  page: TypePaymentListAllId,
  { size, paymentStateCode, startDate, endDate }: TypePaymentListAllFilter,
) => {
  const context = useQuery({
    queryKey: getCacheKey(userKey).payment.list.all.toKeyWithArgs(page, {
      size,
      paymentStateCode,
      startDate,
      endDate,
    }),
    queryFn: async () => {
      const data = await fetchSearchPaymentList(page, { size, paymentStateCode, startDate, endDate })
      return data
    },
    enabled: !!page && !!size,
    placeholderData: keepPreviousData,
  })

  return {
    ...context,
  }
}

export default useSearchPaymentList
