import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { TypeFetchList } from "@/types/cache"

export type TypeSearchChecklistResult = {
  id: number
  title: string
  groupId: number
  groupName: string
}[]

export const fetchSearchChecklistList: TypeFetchList<TypeSearchChecklistResult,null> = async () => {
    const token = await getToken()
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/checklists`,{
        headers: { Authorization: `Bearer ${token}` },
        })
    return data
    }

const useSearchChecklistList = (options?: {enabled?: boolean }) => {
    const context = useQuery({
        queryKey: getCacheKey(userKey).checklist.list.toKey(),
        queryFn: async () => fetchSearchChecklistList(null, {}),
        enabled: options?.enabled ?? true,
        })

    return { ...context }
    }

export default useSearchChecklistList