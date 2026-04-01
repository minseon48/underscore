import Link from "next/link"
import Breadcrumb from "@/components/navigation/Breadcrumb"
import MypageChangeMembership from "@/components/page/MypageChangeMembership"

interface PageProps {
  //
}

const Page = async (props: PageProps) => {
  // const { } = props

  return (
    <>
      <Breadcrumb>
        <Link href="/mypage">마이페이지</Link>
        <Link href="/mypage/profile">회원정보</Link>
        <Link href="/mypage/membership/change">이용권 변경</Link>
      </Breadcrumb>
      <MypageChangeMembership />
    </>
  )
}

export default Page
