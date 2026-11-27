"use client"

import { useEffect, useState } from "react"
import useInitToken from "@/libs/hook/useInitToken"
import useSearchProfile from "@/queries/api/user/useSearchProfile"
import useSearchMembership from "@/queries/api/user/useSearchMembership"
import styled from "styled-components"
import Layout from "@/components/display/Layout"
import MembershipRenewalNotice from "@/components/feedback/MembershipRenewalNotice"
import {
    wasRenewalNoticeDismissedToday,
    dismissRenewalNoticeToday,
    } from "@/libs/membership/renewalNotice"

interface PageLayoutProps extends React.PropsWithChildren {
  //
}



const PageLayout = (props: PageLayoutProps) => {
  const { children } = props
  useInitToken()

  const { data: profileData } = useSearchProfile()
  const { data: membershipData } = useSearchMembership()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
      if (!profileData) return
      if (membershipData?.showRenewalNotice !== true) return
      if (wasRenewalNoticeDismissedToday()) return
      setIsOpen(true)
      }, [profileData, membershipData])

  const onClose = () => {
      dismissRenewalNoticeToday()
      setIsOpen(false)
      }

  return (
    <Layout>
      <Layout.Header />
      <Layout.Navigation />
      <PageLayoutContent>{children}</PageLayoutContent>
      {isOpen && (
          <MembershipRenewalNotice
            daysLeft={membershipData?.daysUntilExpiration ?? 0}
            onClose={onClose}
            />
          )}
    </Layout>
  )
}

const PageLayoutContent = styled(Layout.Content)`
  flex: 1 1 0px;
  display: flex;
  padding-top: 48px;
`

export default PageLayout