import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"

export type TypeSearchMembershipResult = {
  isSubscribed: boolean
  subscriptionCode: string
  effectiveDate?: Date
  expirationDate?: Date
  paymentMethod?: string
  paymentInfo?: string
  paymentAmount?: number
  refundAmount?: number
}

export const fetchSearchMembership: TypeFetchList<TypeSearchMembershipResult, null> = async (key) => {
  // TODO
  // const token = await getToken()
  // const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/membership`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // })
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_MOCKING_URL}/mocks/user/membership`, {
    //
  })
  return data
}

const useSearchMembership = () => {
  const context = useQuery({
    queryKey: getCacheKey(userKey).membership.default.toKey(),
    queryFn: async () => {
      const data = await fetchSearchMembership(null, {})
      return data
    },
  })

  return {
    ...context,
  }
}

export default useSearchMembership
