"use client"

import styled from "styled-components"
import Layout from "@/components/display/Layout"

interface PageLayoutProps extends React.PropsWithChildren {
  //
}

const PageLayout = (props: PageLayoutProps) => {
  const { children } = props

  return (
    <Layout>
      <Layout.Header />
      <Layout.Navigation />
      <PageLayoutContent>{children}</PageLayoutContent>
    </Layout>
  )
}

const PageLayoutContent = styled(Layout.Content)`
  flex: 1 1 0px;
  display: flex;
  padding-top: 48px;
`

export default PageLayout