import { useEffect, useRef, useState } from "react"
import Cookies from "js-cookie"
import axios from "axios"

const isTokenExpired = (token: string) => {
    try{
        const payload = JSON.parse(atob(token.split(".")[1]))
        const exp = payload.exp * 1000
        return Date.now() >= exp
        }catch{
            return true//만료
            }
    }

const useInitToken = () => {
    const [tokenReady, setTokenReady] = useState(false)
    const calledRef = useRef(false)

    useEffect(() => {
        if(calledRef.current) return
        calledRef.current = true

        const token = Cookies.get("authToken")

        if(token && !isTokenExpired(token)){
            setTokenReady(true)
            return
            }

        const init = async () => {
            try{
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/reissue`,
                    {},
                    { withCredentials: true}
                    )

                const token = res.headers["authorization"]?.replace(/^Bearer\s+/i,"")

                if(token) {
                    Cookies.set("authToken", token, { path: "/"})
                    setTokenReady(true)
                    }
                }catch (e) {
                    console.error(e)
                    }
            }
        init()
        }, [])

    return { tokenReady }
    }

export default useInitToken