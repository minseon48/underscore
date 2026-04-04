"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import styled from "styled-components"
import Button from "@/components/general/Button"

export interface PanelViewNavigationProps extends React.HTMLAttributes<HTMLElement> {
  //
}

const PanelViewNavigation = (props: PanelViewNavigationProps) => {
  const { className = "", ...restProps } = props

  const pathname = usePathname()

  return (
    <PanelViewNavigationContainer className={`${className}`} {...restProps}>
      <ol>
        <li>
          <Link href="/map" prefetch={false} passHref={true} legacyBehavior={true}>
            <Button asTag="a" isActive={/\/map(?!\/).*/.test(pathname)}>
              주변정보
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/map/analysis" prefetch={false} passHref={true} legacyBehavior={true}>
            <Button asTag="a" isActive={/\/map\/analysis.*/.test(pathname)}>
              상권분석
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/map/myplace" prefetch={false} passHref={true} legacyBehavior={true}>
            <Button asTag="a" isActive={/\/map\/myplace.*/.test(pathname)}>
              내장소
            </Button>
          </Link>
        </li>
      </ol>
    </PanelViewNavigationContainer>
  )
}

const PanelViewNavigationContainer = styled.nav`
  ol {
    display: flex;
    gap: 8px;
  }
  li {
    flex: 1 1 0px;
  }
  a {
    width: 100%;
  }
`

export default PanelViewNavigation
