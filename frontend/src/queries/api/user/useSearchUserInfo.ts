import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { userKey } from "@/queries/api/user"

export type TypeSearchUserInfoResult = {
    name : string
    email : string
 }


export const fetchSearchUserInfo = async () : Promise<TypeSearchUserInfoResult> => {
    const token = await getToken()
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/info`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        )

    return data
    }

type UseSearchUserInfoOptions = {
    enabled?: boolean
    }


const useSearchUserInfo = (options?: UseSearchUserInfoOptions) => {
    return useQuery({
        queryKey: ["user", "info"],
        queryFn: fetchSearchUserInfo,
        enabled: options?.enabled ?? false,
        })
    }

export default useSearchUserInfo