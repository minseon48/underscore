import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"


const useLogout = () => {
    const router = useRouter()

    const handleLogout = async () => {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/logout`,
            {},
            { withCredentials: true }
          )
        } catch (e) {
          console.error(e)
        } finally {
          Cookies.remove("authToken", { path: "/" })
          router.push("/auth/join")
        }
      }
      return { handleLogout }
    }
    export default useLogout