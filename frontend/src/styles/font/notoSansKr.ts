import { Noto_Sans_KR } from "next/font/google"

const notoSansKr = Noto_Sans_KR({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-notoSansKr",
  weight: ["400", "500", "700", "800"], // Regular Medium Strong Extra
})

export default notoSansKr
