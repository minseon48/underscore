import Link from "next/link"
import Breadcrumb from "@/components/navigation/Breadcrumb"
import MypageChecklistCreate from "@/components/page/MypageChecklistCreate"

const Page = () => {
  return (
    <>
      <Breadcrumb>
        <Link href="/mypage">마이페이지</Link>
        <Link href="/mypage/checklist">체크리스트</Link>
        <Link href="/mypage/checklist/create">등록</Link>
      </Breadcrumb>
      <MypageChecklistCreate />
    </>
  )
}

export default Page
