import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { TypeMyplaceListAllId, TypeMyplaceListAllFilter, userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"

export type TypeSearchMyplaceResult = {
  count: number
  totalCount: number
  items: {
    id: number
    addressName: string
    totalScore: number
    coordinates: {
      latitude: number
      longitude: number
    }
  }[]
}

export const fetchSearchMyplaceList: TypeFetchList<
  TypeSearchMyplaceResult,
  TypeMyplaceListAllId,
  TypeMyplaceListAllFilter
> = async (page, { size }) => {
  // TODO
  // const token = await getToken()
  // const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/myplace`, {
  //   params: {
  //     page,
  //     size,
  //   },
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // })
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_MOCKING_URL}/mocks/user/myplace`, {
    params: {
      page,
      size,
    },
  })
  return data
}

const useSearchMyplaceList = (page: TypeMyplaceListAllId, { size }: TypeMyplaceListAllFilter) => {
  const context = useQuery({
    queryKey: getCacheKey(userKey).myplace.list.all.toKeyWithArgs(page, { size }),
    queryFn: async () => {
      const data = await fetchSearchMyplaceList(page, { size })
      return data
    },
    enabled: !!page && !!size,
  })

  return {
    ...context,
  }
}

export default useSearchMyplaceList
