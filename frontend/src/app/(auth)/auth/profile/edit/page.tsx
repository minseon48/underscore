import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { getCacheKey } from "@/libs/cache"
import { userKey } from "@/queries/api/user"
import { fetchSearchProfile } from "@/queries/api/user/useSearchProfile"
import AuthEditProfile from "@/components/page/AuthEditProfile"

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

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <AuthEditProfile />
    </HydrationBoundary>
  )
}

export default Page
