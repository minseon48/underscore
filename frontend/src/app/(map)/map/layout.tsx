"use client"

import styled from "styled-components"
import MapView from "@/components/display/MapView"
import PanelView from "@/components/display/PanelView"
import Copyright from "@/components/navigation/Copyright"

interface PageLayoutProps extends React.PropsWithChildren {
  tab: React.ReactNode
}

const PageLayout = (props: PageLayoutProps) => {
  const { tab, children } = props

  return (
    <>
      <PanelView>
        <PanelViewHeader>
          <PanelViewNavigation />
        </PanelViewHeader>
        <PanelViewTab>
          {tab}
          {children}
          <PanelViewFooter>
            <Copyright />
          </PanelViewFooter>
        </PanelViewTab>
      </PanelView>
      <MapView />
    </>
  )
}

const PanelViewNavigation = styled(PanelView.Navigation)`
  margin-top: 12px;
`

const PanelViewHeader = styled(PanelView.Header)`
  padding: 18px 20px 14px 20px;
  background: rgb(var(--color-primary600));
  @media ${(props) => props.theme.screen.device.md} {
    padding: 0 20px 14px;
  }
`

const PanelViewTab = styled.div`
  flex: 1 1 0px;
  background: rgb(var(--color-neutral300));
  overflow: auto;
`

const PanelViewFooter = styled.div`
  margin: 24px 0;
  padding: 0 20px;
`

export default PageLayout