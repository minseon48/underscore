import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { getCacheKey } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { fetchSearchProfile } from "@/queries/api/user/useSearchProfile"
import { fetchSearchMyplaceList } from "@/queries/api/user/useSearchMyplaceList"
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
    queryKey: getCacheKey(userKey).myplace.list.all.toKeyWithArgs(1, { size: 10 }),
    queryFn: async () => {
      const data = await fetchSearchMyplaceList(1, { size: 10 })
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