"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styled from "styled-components"
import useNavigation from "@/libs/hook/useNavigation"
import Icon from "@/components/general/Icon"
import Picture from "@/components/display/Picture"

export interface LayoutHeaderProps extends React.HTMLAttributes<HTMLElement> {
  //
}

const LayoutHeader = (props: LayoutHeaderProps) => {
  const { className = "", ...restProps } = props

  const pathname = usePathname()

  const {
    navigationStructure: { isOpened },
    onOpen,
  } = useNavigation()

  return (
    <LayoutHeaderContainer className={`${className}`} {...restProps}>
      <LayoutHeaderLogo>
        <Link href={pathname.match(/^\/[^/]+/)?.[0] ?? "/map"}>
          <Picture src="/logo.svg" alt="logo" ratio={[429, 85]} />
        </Link>
      </LayoutHeaderLogo>
      <LayoutHeaderHamburger type="button" aria-haspopup="menu" aria-expanded={isOpened} onClick={onOpen}>
        <Icon name="Menu" aria-hidden={true} />
        <span className="sr-only">메뉴 열기</span>
      </LayoutHeaderHamburger>
    </LayoutHeaderContainer>
  )
}

const LayoutHeaderLogo = styled.h1`
  a {
    display: block;
    width: 136px;
    padding: 8px;
  }
`

const LayoutHeaderHamburger = styled.button`
  padding: 8px;
  font-size: 16px;
`

const LayoutHeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 20px 0 12px;
  background: rgb(var(--color-neutral100));
  box-shadow: 0px 2px 8px 0px rgba(var(--color-neutral1300), 0.15);
  z-index: 1000;
  ${LayoutHeaderLogo} {
    order: 1;
  }
  ${LayoutHeaderHamburger} {
    order: 0;
  }
`

export default LayoutHeader
