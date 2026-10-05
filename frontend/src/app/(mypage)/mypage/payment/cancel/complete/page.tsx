import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import Link from "next/link"
import Breadcrumb from "@/components/navigation/Breadcrumb"
import MypageCancelComplete from "@/components/page/MypageCancelComplete"

interface PageProps {
    searchParams: Promise<{ paymentId?: string}>
}

const Page = async (props: PageProps) => {
    const searchParams = await props.searchParams
    const queryClient = new QueryClient()
    const dehydratedState = dehydrate(queryClient)

    return (
        <>
            <Breadcrumb>
             <Link href="/mypage">마이페이지</Link>
             <Link href="/mypage/payment/history">결제내역</Link>
             <Link href={`/mypage/payment/cancel/complete?paymentId=${searchParams.paymentId ?? ""}`}>
               환불 완료
             </Link>
            </Breadcrumb>
            <HydrationBoundary state={dehydratedState}>
             <MypageCancelComplete paymentId={Number(searchParams.paymentId ?? 0)} />
            </HydrationBoundary>
        </>
    )
}
export default Page