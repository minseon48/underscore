import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getToken } from "@/libs/cache"

export type TypeSearchAdministrativeDistrictResult = {
    administrativeCode: string
    addressName: string
    coordinates: { latitude: number; longitude: number}
    }[]

export const fetchSearchAdministrativeDistrictList = async (keyword: string) =>{
    const token = await getToken()
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/myplace/administrative-districts`,
        {
            params: { keyword },
            headers: { Authorization: `Bearer ${token}`},
            },
        )
        return data as TypeSearchAdministrativeDistrictResult
    }

const useSearchAdministrativeDistrictList = (keyword: string) => {
    const context = useQuery({
        queryKey: ["myplace", "administrative-districts", keyword],
        queryFn: () => fetchSearchAdministrativeDistrictList(keyword),
        enabled: keyword.trim().length >= 1,
        })

    return { ...context, items: context.data ?? [] }
    }
export default useSearchAdministrativeDistrictList