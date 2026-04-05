"use client"

import { useEffect, useRef, useState } from "react"
import styled, { css } from "styled-components"
import { Timer, clearTimer, setTimer } from "@/libs/timer"

export interface MenuGroupProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  isReady: boolean
}

interface TypeStructure {
  isPending: boolean
  isOpened: boolean
}

const MenuGroup = (props: MenuGroupProps) => {
  const { isReady, className = "", children, ...restProps } = props

  const timers = useRef<Timer>({ delay: null })
  const [structure, setStructure] = useState<TypeStructure>({
    isPending: false,
    isOpened: false,
  })

  const opOpen = async () => {
    clearTimer(timers, { key: "delay" })
    setStructure((prev) => ({ ...prev, isPending: true, isOpened: false }))
    clearTimer(timers, { key: "delay" })
    await setTimer(timers, { key: "delay", delay: 50 })
    setStructure((prev) => ({ ...prev, isPending: false, isOpened: true }))
  }

  const onClose = async () => {
    clearTimer(timers, { key: "delay" })
    setStructure((prev) => ({ ...prev, isPending: true, isOpened: true }))
    clearTimer(timers, { key: "delay" })
    await setTimer(timers, { key: "delay", delay: 200 })
    setStructure((prev) => ({ ...prev, isPending: false, isOpened: false }))
  }

  useEffect(() => {
    isReady ? opOpen() : onClose()
  }, [isReady])

  if (!children) return null

  return (
    <MenuGroupContainer
      className={`${className}`}
      $isPending={structure.isPending}
      $isOpened={structure.isOpened}
      {...restProps}
    >
      <ul>{children}</ul>
    </MenuGroupContainer>
  )
}

interface MenuGroupStyled {
  $isPending: boolean
  $isOpened: boolean
}

const MenuGroupContainer = styled.div<MenuGroupStyled>`
  position: relative;
  ul {
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
    border-radius: 8px;
  }
  ul & {
    display: none;
    grid-template-rows: 0fr;
    transition-property: grid-template-rows, padding-top;
    transition-duration: 200ms;
    transition-timing-function: var(--motion-ease-out);
    transition-delay: 0s;
  }
  ul & ul {
    background: rgba(var(--color-neutral1300), 0.02);
  }
  ${(props) => {
    if (props.$isPending) {
      return css`
        && {
          display: grid;
        }
      `
    }
  }}
  ${(props) => {
    if (props.$isOpened && !props.$isPending) {
      return css`
        && {
          display: grid;
          grid-template-rows: 1fr;
          &:not(:first-child) {
            padding-top: 4px;
          }
        }
      `
    }
  }}
`

export default MenuGroup
