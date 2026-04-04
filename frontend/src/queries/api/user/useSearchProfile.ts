import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"

export type TypeSearchProfileResult = {
  isSubscribed: boolean
  name: string
  email: string
}

export const fetchSearchProfile: TypeFetchList<TypeSearchProfileResult, null> = async (key) => {
  // TODO
  // const token = await getToken()
  // const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // })
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_MOCKING_URL}/mocks/user/profile`, {
    //
  })
  return data
}

const useSearchProfile = () => {
  const context = useQuery({
    queryKey: getCacheKey(userKey).profile.default.toKey(),
    queryFn: async () => {
      const data = await fetchSearchProfile(null, {})
      return data
    },
  })

  return {
    ...context,
  }
}

export default useSearchProfile
