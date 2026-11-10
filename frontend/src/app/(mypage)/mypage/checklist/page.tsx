import Link from "next/link"
import Breadcrumb from "@/components/navigation/Breadcrumb"
import MypageChecklist from "@/components/page/MypageChecklist"

const Page = () => {
  return (
    <>
      <Breadcrumb>
        <Link href="/mypage">마이페이지</Link>
        <Link href="/mypage/checklist">체크리스트</Link>
      </Breadcrumb>
      <MypageChecklist />
    </>
  )
}

export default Page
