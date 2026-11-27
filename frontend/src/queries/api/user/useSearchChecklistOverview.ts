import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { TypeChecklistOverview } from "@/queries/api/user/checklist/type"

export const fetchChecklistOverview = async (checklistId: number) => {
  const token = await getToken()
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/checklists/${checklistId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return data as TypeChecklistOverview
}

export const useSearchChecklistOverview = (
  checklistId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: getCacheKey(userKey).checklist.detail.toKeyWithArgs(checklistId),
    queryFn: () => fetchChecklistOverview(checklistId),
    enabled: (options?.enabled ?? true) && checklistId > 0,
  })
}

export default useSearchChecklistOverview
