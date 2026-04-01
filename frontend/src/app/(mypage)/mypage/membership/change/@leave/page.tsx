import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import Link from "next/link"
import { getCacheKey } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { fetchSearchMembership } from "@/queries/api/user/useSearchMembership"
import Breadcrumb from "@/components/navigation/Breadcrumb"
import MypageLeaveMembership from "@/components/page/MypageLeaveMembership"

interface PageProps {
  //
}

const Page = async (props: PageProps) => {
  // const { } = props

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: getCacheKey(userKey).membership.default.toKey(),
    queryFn: async () => {
      const data = await fetchSearchMembership(null, {})
      return data
    },
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <Breadcrumb>
        <Link href="/mypage">마이페이지</Link>
        <Link href="/mypage/profile">회원정보</Link>
        <Link href="/mypage/membership/change">이용권 종료</Link>
      </Breadcrumb>
      <HydrationBoundary state={dehydratedState}>
        <MypageLeaveMembership />
      </HydrationBoundary>
    </>
  )
}

export default Page