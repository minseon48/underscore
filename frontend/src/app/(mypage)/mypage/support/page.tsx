import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import Link from "next/link"
import { getCacheKey } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { fetchSearchSupportList } from "@/queries/api/user/useSearchSupportList"
import { TypeRecruitmentStatus, TypeSupportRegion } from "@/components/form/SearchSupport"
import Breadcrumb from "@/components/navigation/Breadcrumb"
import MypageSupport from "@/components/page/MypageSupport"

const Page = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: getCacheKey(userKey).support.list.all.toKeyWithArgs(1, {
      size: 10,
      startDate: undefined,
      endDate: undefined,
      region: TypeSupportRegion.All,
      recruitmentStatus: TypeRecruitmentStatus.All,
    }),
    queryFn: async () =>
      fetchSearchSupportList(1, {
        size: 10,
        startDate: undefined,
        endDate: undefined,
        region: TypeSupportRegion.All,
        recruitmentStatus: TypeRecruitmentStatus.All,
      }),
  })

  return (
    <>
      <Breadcrumb>
        <Link href="/mypage">마이페이지</Link>
        <Link href="/mypage/support">지원사업</Link>
      </Breadcrumb>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MypageSupport />
      </HydrationBoundary>
    </>
  )
}

export default Page