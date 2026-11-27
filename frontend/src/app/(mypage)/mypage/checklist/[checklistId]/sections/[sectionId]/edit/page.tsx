import Link from "next/link"
import Breadcrumb from "@/components/navigation/Breadcrumb"
import MypageChecklistSectionEdit from "@/components/page/MypageChecklistSectionEdit"

interface PageProps {
  params: {
    checklistId: string
    sectionId: string
  }
}

const Page = (props: PageProps) => {
  const { params } = props

  return (
    <>
      <Breadcrumb>
        <Link href="/mypage">마이페이지</Link>
        <Link href="/mypage/checklist">체크리스트</Link>
        <Link href={`/mypage/checklist/${params.checklistId}`}>상세</Link>
        <Link href={`/mypage/checklist/${params.checklistId}/sections/${params.sectionId}`}>
          영역
        </Link>
        <Link
          href={`/mypage/checklist/${params.checklistId}/sections/${params.sectionId}/edit`}
        >
          편집
        </Link>
      </Breadcrumb>
      <MypageChecklistSectionEdit />
    </>
  )
}

export default Page
