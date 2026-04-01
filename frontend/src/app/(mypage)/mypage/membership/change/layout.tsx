"use client"

import useSearchMembership from "@/queries/api/user/useSearchMembership"
import { TypeSubscriptionCode } from "@/components/form/ChangeMembership/type"

interface PageLayoutProps extends React.PropsWithChildren {
  join: React.ReactNode
  leave: React.ReactNode
}

const PageLayout = (props: PageLayoutProps) => {
  const { join, leave, children } = props

  const { data: membershipData } = useSearchMembership()

  return (
    <>
      {membershipData?.subscriptionCode === TypeSubscriptionCode.Free && join}
      {membershipData?.subscriptionCode === TypeSubscriptionCode.Month && leave}
      {membershipData?.subscriptionCode === TypeSubscriptionCode.Year && leave}
      {children}
    </>
  )
}

export default PageLayout