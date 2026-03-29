"use client"

import Link from "next/link"
import styled from "styled-components"
import Layout from "@/components/display/Layout"
import Picture from "@/components/display/Picture"
import Copyright from "@/components/navigation/Copyright"

interface PageLayoutProps extends React.PropsWithChildren {
  //
}

const PageLayout = (props: PageLayoutProps) => {
  const { children } = props

  return (
    <PageLayoutContainer>
      <PageLayoutHeader>
        <PageLayoutHeaderLogo>
          <Link href="/map">
            <Picture src="/logo-vertical.svg" alt="logo" ratio={[339, 252]} />
          </Link>
        </PageLayoutHeaderLogo>
      </PageLayoutHeader>
      <PageLayoutContent>{children}</PageLayoutContent>
      <PageLayoutFooter>
        <Copyright />
      </PageLayoutFooter>
    </PageLayoutContainer>
  )
}

const PageLayoutHeaderLogo = styled.h1`
  a {
    margin: 0 auto;
    display: block;
    width: 112px;
    padding: 8px;
  }
`

const PageLayoutHeader = styled.header`
  /*  */
`

const PageLayoutContent = styled(Layout.Content)`
  margin-top: 24px;
`

const PageLayoutFooter = styled.footer`
  margin-top: 56px;
`

const PageLayoutContainer = styled(Layout)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 360px;
  padding: 20px;
`

export default PageLayout