import axios from "axios"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { TypeSupportListAllId, TypeSupportListAllFilter, userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"
import { TypeRecruitmentStatus } from "@/components/form/SearchSupport"

export type TypeSearchSupportListResult = {
  count: number
  totalCount: number
  items: {
    pbancSn: string
    bizPbancNm: string
    suptBizClsfc: string
    suptRegin: string
    pbancRcptBgngDt: string
    pbancRcptEndDt: string
    rcrtPrgsYn: TypeRecruitmentStatus
    pbancNtrpNm: string
    sprvInst: string
    detlPgUrl?: string
  }[]
}

export const fetchSearchSupportList: TypeFetchList<
   TypeSearchSupportListResult,
   TypeSupportListAllId,
   TypeSupportListAllFilter
> = async (page, { size, startDate, endDate, region, recruitmentStatus }) => {
    const token = await getToken()
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/support`, {
        params: {
            page,
            size,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            region: region === "All" ? undefined : region,
            recruitmentStatus: recruitmentStatus === "All" ? undefined : recruitmentStatus,
            },

        headers: {
            Authorization: `Bearer ${token}`,
            },
        })

    return data
    }

const useSearchSupportList = (
    page: TypeSupportListAllId,
    { size, startDate, endDate, region, recruitmentStatus }: TypeSupportListAllFilter,
    ) => {
        const context = useQuery({
            queryKey: getCacheKey(userKey).support.list.all.toKeyWithArgs(page, {
                size,
                startDate,
                endDate,
                region,
                recruitmentStatus,
                }),
            queryFn: async () => {
                return fetchSearchSupportList(page, { size, startDate, endDate, region, recruitmentStatus })
                },

            enabled: !!page && !!size,
            placeholderData: keepPreviousData,
            })

        return { ...context }
        }

    export default useSearchSupportList