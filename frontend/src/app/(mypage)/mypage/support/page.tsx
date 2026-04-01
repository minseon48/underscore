import Link from "next/link"
import Breadcrumb from "@/components/navigation/Breadcrumb"

interface PageProps {
  //
}

const Page = (props: PageProps) => {
  // const { } = props

  return (
    <>
      <Breadcrumb>
        <Link href="/mypage">마이페이지</Link>
        <Link href="/mypage/support">지원사업</Link>
      </Breadcrumb>
      <section>
        <h2>지원사업(/mypage/support)</h2>
      </section>
    </>
  )
}

export default Page