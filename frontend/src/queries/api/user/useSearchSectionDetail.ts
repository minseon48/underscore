import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { TypeSectionDetail } from "@/queries/api/user/checklist/type"

export const fetchSectionDetail = async (checklistId: number, sectionId: number) => {
  const token = await getToken()
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/checklists/${checklistId}/sections/${sectionId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return data as TypeSectionDetail
}

export const useSearchSectionDetail = (
  checklistId: number,
  sectionId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: getCacheKey(userKey).checklist.section.toKeyWithArgs(checklistId, sectionId),
    queryFn: () => fetchSectionDetail(checklistId, sectionId),
    enabled: (options?.enabled ?? true) && checklistId > 0 && sectionId > 0,
  })
}

export default useSearchSectionDetail
