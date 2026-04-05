import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { isEquals } from "@/libs/utils"
import { getCacheKey } from "@/libs/cache"
import { TypeCategoryListAllId, TypeCategoryListAllFilter, mapKey } from "@/queries/api/map"
import { TypeFetchList } from "@/types/cache"

export type TypeSearchCategoryResult = {
  meta: {
    total_count: number
    pageable_count: number
    is_end: boolean
    same_name: {
      region: string[]
      keyword: string
      selected_region: string
    } | null
  }
  documents: {
    id: string
    place_name: string
    category_name: string
    category_group_code: string
    category_group_name: string
    phone: string
    address_name: string
    road_address_name: string
    x: string
    y: string
    place_url: string
    distance: string
  }[]
}

export const fetchSearchCategoryList: TypeFetchList<
  TypeSearchCategoryResult,
  TypeCategoryListAllId,
  TypeCategoryListAllFilter
> = async (page, { level, categoryCode, searchBounds, size }) => {
  const { data } = await axios.get(`/map/search-category`, {
    params: {
      page,
      size,
      category_group_code: categoryCode,
      rect: `${searchBounds[1]},${searchBounds[0]},${searchBounds[3]},${searchBounds[2]}`,
    },
    headers: {
      Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_API_KAKAO_REST_KEY}`,
    },
  })
  return data
}

const useSearchCategoryList = (
  page: TypeCategoryListAllId,
  { level, categoryCode, searchBounds, size }: TypeCategoryListAllFilter,
) => {
  const context = useQuery({
    queryKey: getCacheKey(mapKey).category.list.all.toKeyWithArgs(page, { level, categoryCode, searchBounds, size }),
    queryFn: async () => {
      const data = await fetchSearchCategoryList(page, { level, categoryCode, searchBounds, size })
      return data
    },
    enabled: !!page && !!categoryCode && !isEquals([0, 0, 0, 0], searchBounds) && [1, 2, 3].includes(level),
    staleTime: 1000 * 60 * 60 * 23,
    gcTime: 1000 * 60 * 60 * 24,
  })

  return {
    ...context,
  }
}

export default useSearchCategoryList
