import Link from "next/link"
import Breadcrumb from "@/components/navigation/Breadcrumb"

interface PageProps {
  params: {
    checklistId: string
  }
}

const Page = (props: PageProps) => {
  const { params } = props

  return (
    <>
      <Breadcrumb>
        <Link href="/mypage">마이페이지</Link>
        <Link href="/mypage/checklist">체크리스트</Link>
        <Link href={`/mypage/checklist/${params.checklistId}`}>{params.checklistId}</Link>
      </Breadcrumb>
      <section>
        <h2>체크리스트 상세(/mypage/checklist/{params.checklistId})</h2>
      </section>
    </>
  )
}

export default Page
