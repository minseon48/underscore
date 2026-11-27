"use client"

import { useSearchParams } from "next/navigation"
import useSearchMembership from "@/queries/api/user/useSearchMembership"
import { TypeSubscriptionCode } from "@/components/form/ChangeMembership/type"

interface PageLayoutProps extends React.PropsWithChildren {
  join: React.ReactNode
  leave: React.ReactNode
}

const PageLayout = (props: PageLayoutProps) => {
  const { join, leave, children } = props

  const searchParams = useSearchParams()
  const intent = searchParams.get("intent")
  const { data: membershipData } = useSearchMembership()

  const isFree = membershipData?.subscriptionCode === TypeSubscriptionCode.Free
  const isPaid =
    membershipData?.subscriptionCode === TypeSubscriptionCode.Month ||
    membershipData?.subscriptionCode === TypeSubscriptionCode.Year

  const shouldShowJoin =
    isFree || intent === "renew" || (isPaid && membershipData?.showRenewalNotice && intent !== "leave")

  const shouldShowLeave =
    isPaid && (intent === "leave" || (!membershipData?.showRenewalNotice && intent !== "renew"))

  return (
    <>
      {shouldShowJoin && join}
      {shouldShowLeave && leave}
      {children}
    </>
  )
}

export default PageLayout
