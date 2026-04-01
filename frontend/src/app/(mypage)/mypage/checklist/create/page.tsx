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
        <Link href="/mypage/checklist">체크리스트</Link>
        <Link href="/mypage/checklist/create">등록</Link>
      </Breadcrumb>
      <section>
        <h2>체크리스트 등록(/mypage/checklist/create)</h2>
      </section>
    </>
  )
}

export default Page