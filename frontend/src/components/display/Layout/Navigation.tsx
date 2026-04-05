"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import styled, { css } from "styled-components"
import useNavigation from "@/libs/hook/useNavigation"
import useFocusTrap from "@/libs/hook/useFocusTrap"
import Icon from "@/components/general/Icon"
import Picture from "@/components/display/Picture"
import Menu from "@/components/navigation/Menu"

export interface LayoutNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const menuItems = [
  {
    key: "map",
    label: "지도페이지",
    href: "/map",
    items: [
      {
        key: "category",
        label: "주변정보",
        href: "/map",
      },
      {
        key: "analysis",
        label: "상권분석",
        href: "/map/analysis",
      },
      {
        key: "myplace",
        label: "내장소",
        href: "/map/myplace",
      },
    ],
  },
  {
    key: "mypage",
    label: "마이페이지",
    href: "/mypage",
    items: [
      {
        key: "support",
        label: "지원사업",
        href: "/mypage/support",
      },
      {
        key: "checklist",
        label: "체크리스트",
        href: "/mypage/checklist",
      },
      {
        key: "profile",
        label: "회원정보",
        href: "/mypage/profile",
      },
    ],
  },
  {
    key: "join",
    label: "로그인",
    href: "/auth/join",
  },
  // TODO
  {
    key: "logout",
    label: "로그아웃",
    onClick: () => console.log("logout"),
  },
]

const LayoutNavigation = (props: LayoutNavigationProps) => {
  const { className = "", ...restProps } = props

  const pathname = usePathname()
  const currentPath = pathname.split("/").filter(Boolean)

  const {
    navigationStructure: { isPending, isOpened },
    onClose,
  } = useNavigation()

  const {
    focusTrapRefs: { containerRef },
    onActivate,
    onDeactivate,
  } = useFocusTrap()

  useEffect(() => {
    if (isOpened && !isPending) onActivate()
    else onDeactivate()
  }, [isOpened, isPending])

  if (!isOpened && !isPending) return null

  return (
    <LayoutNavigationContainer
      ref={containerRef}
      className={`${className}`}
      $isOpened={isOpened}
      $isPending={isPending}
      onClick={(event) => event.target === containerRef.current && onClose()}
      {...restProps}
    >
      <LayoutNavigationPanel tabIndex={0}>
        <LayoutNavigationHeader>
          <LayoutNavigationLogo>
            <Picture src="/logo.svg" alt="logo" ratio={[429, 85]} />
          </LayoutNavigationLogo>
        </LayoutNavigationHeader>
        <LayoutNavigationMenu
          items={menuItems}
          defaultOpenKeys={currentPath.slice(0, currentPath.length - 1)}
          defaultSelectedKeys={currentPath}
          onNavigated={onClose}
        />
        <LayoutNavigationClose type="button" onClick={onClose}>
          <Icon name="Close" aria-hidden={true} />
          <span className="sr-only">메뉴 닫기</span>
        </LayoutNavigationClose>
      </LayoutNavigationPanel>
    </LayoutNavigationContainer>
  )
}

interface LayoutNavigationStyled {
  $isPending: boolean
  $isOpened: boolean
}

const LayoutNavigationLogo = styled.strong`
  display: block;
  width: 120px;
`

const LayoutNavigationClose = styled.button`
  position: absolute;
  top: 16px;
  right: 12px;
  padding: 8px;
  font-size: 16px;
`

const LayoutNavigationHeader = styled.div`
  padding: 20px 54px 0 20px;
`

const LayoutNavigationMenu = styled(Menu)`
  padding: 20px;
`

const LayoutNavigationPanel = styled.aside`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 200px;
  max-width: 296px;
  height: 100%;
  background-color: rgb(var(--color-neutral100));
  transform: translateX(-100%);
  transition: transform 200ms;
  overflow-y: auto;
  box-shadow: 0px 2px 8px 0px rgba(var(--color-neutral1300), 0.15);
`

const LayoutNavigationContainer = styled.div<LayoutNavigationStyled>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(var(--var, 1vh) * 100);
  background-color: rgba(var(--color-neutral1300), 0);
  transition: background-color 200ms;
  z-index: 1000;
  ${(props) => {
    if (props.$isOpened && !props.$isPending) {
      return css`
        background-color: rgba(var(--color-neutral1300), 0.3);
        ${LayoutNavigationPanel} {
          transform: translateX(0%);
        }
      `
    }
  }}
  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`

export default LayoutNavigation