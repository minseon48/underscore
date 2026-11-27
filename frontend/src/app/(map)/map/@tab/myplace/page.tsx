import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { getCacheKey } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { fetchSearchProfile } from "@/queries/api/user/useSearchProfile"
import { fetchSearchMyplaceGroupList } from "@/queries/api/user/useSearchMyplaceGroupList"
import MapMyplace from "@/components/page/MapMyplace"

interface PageProps {
  //
}

const Page = async (props: PageProps) => {
  // const { } = props

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: getCacheKey(userKey).profile.default.toKey(),
    queryFn: async () => {
      const data = await fetchSearchProfile(null, {})
      return data
    },
  })

  await queryClient.prefetchQuery({
    queryKey: getCacheKey(userKey).myplace.group.list.toKey(),
    queryFn: async () => {
      const data = await fetchSearchMyplaceGroupList(null, {})
      return data
    },
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <MapMyplace />
    </HydrationBoundary>
  )
}

export default Page
