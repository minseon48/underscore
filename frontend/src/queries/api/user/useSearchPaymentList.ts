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
  }[]
}

export const fetchSearchPaymentList: TypeFetchList<
  TypeSearchPaymentListResult,
  TypePaymentListAllId,
  TypePaymentListAllFilter
> = async (page, { size, paymentPeriodCode, paymentStateCode, startDate, endDate }) => {
  // TODO
  // const token = await getToken()
  // const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/payment`, {
  //   params: {
  //     size,
  //     paymentPeriodCode,
  //     paymentStateCode,
  //     startDate,
  //     endDate,
  //   },
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // })
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_MOCKING_URL}/mocks/user/payment`, {
    params: {
      size,
      paymentPeriodCode,
      paymentStateCode,
      startDate,
      endDate,
    },
  })
  return data
}

const useSearchPaymentList = (
  page: TypePaymentListAllId,
  { size, paymentPeriodCode, paymentStateCode, startDate, endDate }: TypePaymentListAllFilter,
) => {
  const context = useQuery({
    queryKey: getCacheKey(userKey).payment.list.all.toKeyWithArgs(page, {
      size,
      paymentPeriodCode,
      paymentStateCode,
      startDate,
      endDate,
    }),
    queryFn: async () => {
      const data = await fetchSearchPaymentList(page, { size, paymentPeriodCode, paymentStateCode, startDate, endDate })
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
