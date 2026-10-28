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
    memo: string | null
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
> = async (page, { size, groupId }) => {
  const token = await getToken()
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/myplace`, {
    params: {
      page,
      size,
      groupId
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}

const useSearchMyplaceList = (page: TypeMyplaceListAllId, { size, groupId }: TypeMyplaceListAllFilter) => {
  const context = useQuery({
    queryKey: getCacheKey(userKey).myplace.list.all.toKeyWithArgs(page, { size, groupId }),
    queryFn: async () => {
      const data = await fetchSearchMyplaceList(page, { size, groupId })
      return data
    },
    enabled: !!page && !!size && !!groupId,
  })

  return {
    ...context,
  }
}

export default useSearchMyplaceList
