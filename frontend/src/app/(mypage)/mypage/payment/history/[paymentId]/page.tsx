import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import Link from "next/link"
import { getCacheKey } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { fetchSearchPaymentDetail } from "@/queries/api/user/useSearchPaymentDetail"
import Breadcrumb from "@/components/navigation/Breadcrumb"
import MypagePaymentDetail from "@/components/page/MypagePaymentDetail"

interface PageProps {
  params: {
    paymentId: string
  }
}

const Page = async (props: PageProps) => {
  const { params } = props

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: getCacheKey(userKey).payment.detail.toKeyWithArgs(parseInt(`${params?.paymentId ?? 0}`)),
    queryFn: async () => {
      const data = await fetchSearchPaymentDetail(parseInt(`${params?.paymentId ?? 0}`), {})
      return data
    },
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <Breadcrumb>
        <Link href="/mypage">마이페이지</Link>
        <Link href="/mypage/profile">회원정보</Link>
        <Link href="/mypage/payment/history">결제내역</Link>
        <Link href={`mypage/payment/history/${params?.paymentId ?? 0}`}>{params?.paymentId ?? 0}</Link>
      </Breadcrumb>
      <HydrationBoundary state={dehydratedState}>
        <MypagePaymentDetail />
      </HydrationBoundary>
    </>
  )
}

export default Page