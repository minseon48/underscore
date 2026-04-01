"use client"

import styled from "styled-components"
import Layout from "@/components/display/Layout"
import Copyright from "@/components/navigation/Copyright"

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
      <PageLayoutFooter>
        <Copyright />
      </PageLayoutFooter>
    </Layout>
  )
}

const PageLayoutContent = styled(Layout.Content)`
  padding: 48px 50px 0;
  background: rgb(var(--color-neutral300));
  > nav {
    padding: 16px 0;
  }
  > section {
    padding: 24px;
    background: rgb(var(--color-neutral100));
    border-radius: 12px;
  }
  @media ${(props) => props.theme.screen.device.md} {
    padding: 48px 20px 0;
  }
`

const PageLayoutFooter = styled.footer`
  flex: 1 1 0px;
  padding: 24px 20px;
  background: rgb(var(--color-neutral300));
`

export default PageLayout