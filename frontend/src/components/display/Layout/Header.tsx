"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import styled from "styled-components"
import useNavigation from "@/libs/hook/useNavigation"
import useInitToken from "@/libs/hook/useInitToken"
import useLogout from "@/libs/hook/useLogout"
import useSearchProfile from "@/queries/api/user/useSearchProfile"
import Icon from "@/components/general/Icon"
import Picture from "@/components/display/Picture"

export interface LayoutHeaderProps extends React.HTMLAttributes<HTMLElement> {
  //
}

const LayoutHeader = (props: LayoutHeaderProps) => {
  const { className = "", ...restProps } = props

  const router = useRouter()
  const pathname = usePathname()
  const profileRef = useRef<HTMLDivElement>(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const { tokenReady } = useInitToken()
  const { data: profileData } = useSearchProfile({ enabled: tokenReady })
  const { handleLogout } = useLogout()
  const isLoggedIn = Boolean(profileData)

  const {
    navigationStructure: { isOpened },
    onOpen,
  } = useNavigation()

  useEffect(() => {
    if (!isProfileMenuOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [isProfileMenuOpen])

  const onProfileClick = () => {
    if (!isLoggedIn) {
      router.push("/auth/join")
      return
    }
    setIsProfileMenuOpen((prev) => !prev)
  }

  const onLogoutClick = () => {
    setIsProfileMenuOpen(false)
    handleLogout()
  }

  return (
    <LayoutHeaderContainer className={`${className}`} {...restProps}>
      <LayoutHeaderHamburger type="button" aria-haspopup="menu" aria-expanded={isOpened} onClick={onOpen}>
        <Icon name="Menu" aria-hidden={true} />
        <span className="sr-only">메뉴 열기</span>
      </LayoutHeaderHamburger>
      <LayoutHeaderLogo>
        <Link href={pathname.match(/^\/[^/]+/)?.[0] ?? "/map"}>
          <Picture src="/logo.svg" alt="logo" ratio={[429, 85]} />
        </Link>
      </LayoutHeaderLogo>
      <LayoutHeaderProfileWrap ref={profileRef}>
        <LayoutHeaderProfile
          type="button"
          aria-haspopup="menu"
          aria-expanded={isLoggedIn ? isProfileMenuOpen : undefined}
          aria-label={isLoggedIn ? "프로필 메뉴" : "로그인"}
          onClick={onProfileClick}
        >
          {profileData?.name?.[0] ? (
            <span>{profileData.name[0]}</span>
          ) : (
            <Icon name="User" aria-hidden={true} />
          )}
        </LayoutHeaderProfile>
        {isLoggedIn && isProfileMenuOpen && (
          <LayoutHeaderProfileMenu role="menu">
            <button type="button" role="menuitem" onClick={onLogoutClick}>
              로그아웃
            </button>
          </LayoutHeaderProfileMenu>
        )}
      </LayoutHeaderProfileWrap>
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

const LayoutHeaderProfile = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgb(var(--color-neutral300));
  color: rgb(var(--color-neutral900));
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
`

const LayoutHeaderProfileMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 120px;
  padding: 4px;
  border-radius: 8px;
  background: rgb(var(--color-neutral100));
  box-shadow: 0px 2px 8px 0px rgba(var(--color-neutral1300), 0.15);
  z-index: 1001;

  button {
    display: block;
    width: 100%;
    padding: 10px 12px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    text-align: left;
    font-size: 14px;
    color: rgb(var(--color-neutral1100));
    cursor: pointer;

    &:hover {
      background: rgb(var(--color-neutral200));
    }
  }
`

const LayoutHeaderProfileWrap = styled.div`
  position: relative;
  margin-left: auto;
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
  ${LayoutHeaderHamburger} {
    order: 0;
  }
  ${LayoutHeaderLogo} {
    order: 1;
  }
  ${LayoutHeaderProfileWrap} {
    order: 2;
  }
`

export default LayoutHeader
