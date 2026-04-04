import { useMemo } from "react"
import axios from "axios"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getCacheKey } from "@/libs/cache"
import { mapKey, TypeLocationListAllId, TypeLocationListAllFilter } from "@/queries/api/map"
import { TypeFetchList } from "@/types/cache"

export type TypeSearchLocationResult = {
  meta: {
    is_end: boolean
    pageable_count: number
    total_count: number
  }
  documents: {
    address_name: string
    y: string
    x: string
    address_type: string
    address: {
      address_name: string
      region_1depth_name: string
      region_2depth_name: string
      region_3depth_name: string
      region_3depth_h_name: string
      h_code: string
      b_code: string
      mountain_yn: string
      main_address_no: string
      sub_address_no: string
      x: string
      y: string
    }
    road_address: {
      address_name: string
      region_1depth_name: string
      region_2depth_name: string
      region_3depth_name: string
      road_name: string
      underground_yn: string
      main_building_no: string
      sub_building_no: string
      building_name: string
      zone_no: string
      y: string
      x: string
    } | null
  }[]
}

export const fetchSearchLocationList: TypeFetchList<
  TypeSearchLocationResult,
  TypeLocationListAllId,
  TypeLocationListAllFilter
> = async (page, { searchKeyword }) => {
  const { data } = await axios.get(`/map/search-location`, {
    params: {
      page: page,
      query: encodeURIComponent(searchKeyword),
    },
    headers: {
      Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_API_KAKAO_REST_KEY}`,
    },
  })
  return data
}

const useSearchLocationList = ({ searchKeyword }: TypeLocationListAllFilter) => {
  const context = useInfiniteQuery({
    queryKey: getCacheKey(mapKey).location.list.all.toKeyWithArgs(Infinity, { searchKeyword }),
    queryFn: async ({ pageParam = 1 }: { pageParam: TypeLocationListAllId }) => {
      const data = await fetchSearchLocationList(pageParam, { searchKeyword })
      return data
    },
    getNextPageParam: (lastPage, allPages) => {
      return !lastPage.meta.is_end ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
    enabled: !!searchKeyword,
    staleTime: 1000 * 60 * 60 * 23,
    gcTime: 1000 * 60 * 60 * 24,
  })

  const flatData = useMemo(() => {
    if (!context.data || !context.data.pages) return []
    return context.data.pages.flatMap((page) => page.documents)
  }, [context.data])

  return {
    ...context,
    flatData,
    isSelected: flatData.length === 1 && searchKeyword === flatData[0].address_name,
  }
}

export default useSearchLocationList
