import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"

export type TypeSearchMyplaceGroupResult = {
    id: number
    name: string
    isDefault: boolean
    placeCount: number
    maxCount: number
    }[]

export const fetchSearchMyplaceGroupList: TypeFetchList<TypeSearchMyplaceGroupResult, null> = async () => {
    const token = await getToken()
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/myplace/groups`, {
        headers: {
            Authorization: `Bearer ${token}`,
            },
        })
    return data
    }

const useSearchMyplaceGroupList = () => {
    const context = useQuery({
        queryKey: getCacheKey(userKey).myplace.group.list.toKey(),
        queryFn: async () => {
            const data = await fetchSearchMyplaceGroupList(null, {})
            return data
            },
        })
    return {
        ...context,
        }
    }

export default useSearchMyplaceGroupList