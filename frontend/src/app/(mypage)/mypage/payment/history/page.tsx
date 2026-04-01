import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import Link from "next/link"
import { getCacheKey } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { fetchSearchPaymentList } from "@/queries/api/user/useSearchPaymentList"
import Breadcrumb from "@/components/navigation/Breadcrumb"
import MypagePaymentHistory from "@/components/page/MypagePaymentHistory"
import { TypePaymentPeriodCode, TypePaymentStateCode } from "@/components/form/SearchPayment"

interface PageProps {
  //
}

const Page = async (props: PageProps) => {
  // const { } = props

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: getCacheKey(userKey).payment.list.all.toKeyWithArgs(1, {
      size: 10,
      paymentStateCode: TypePaymentStateCode["All"],
      paymentPeriodCode: TypePaymentPeriodCode["All"],
      startDate: undefined,
      endDate: undefined,
    }),
    queryFn: async () => {
      const data = await fetchSearchPaymentList(1, {
        size: 10,
        paymentStateCode: TypePaymentStateCode["All"],
        paymentPeriodCode: TypePaymentPeriodCode["All"],
        startDate: undefined,
        endDate: undefined,
      })
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
      </Breadcrumb>
      <HydrationBoundary state={dehydratedState}>
        <MypagePaymentHistory />
      </HydrationBoundary>
    </>
  )
}

export default Page