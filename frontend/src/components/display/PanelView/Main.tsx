"use client"

import { useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import styled, { css } from "styled-components"
import useMount from "@/libs/hook/useMount"
import useTouch from "@/libs/hook/useTouch"
import { atomGlobal } from "@/stores/global"
import { atomMap } from "@/stores/map"

export interface PanelViewMainProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const PanelViewMain = (props: PanelViewMainProps) => {
  const { className = "", children, ...restProps } = props

  const global = useRecoilValue(atomGlobal)
  const [map, setMap] = useRecoilState(atomMap)

  const {
    touchRefs: { containerRef, contentRef },
    onInit,
    onRemove,
  } = useTouch({
    updateTouch: ({ currentState }) => {
      if (!containerRef.current) return
      if (currentState.moved.directionY === 0) {
        containerRef.current.style.removeProperty("transition")
        containerRef.current.style.removeProperty("transform")
      } else {
        const translateY = `calc(${map.mode === "Advanced" ? "var(--var, 1vh) * -100 + 48px + 20px" : "0px - 120px"} + ${(currentState.moved.movedY || 0) / 3}px)`
        containerRef.current.style.setProperty("transition", "none")
        containerRef.current.style.setProperty("transform", `translateY(${translateY})`)
      }
    },
    afterTouch: ({ currentState }) => {
      if (currentState.moved.directionY === -1 && currentState.moved.movedY > 100) {
        setMap((prev) => ({ ...prev, mode: "Simplified" }))
      } else if (currentState.moved.directionY === 1 && currentState.moved.movedY < 100) {
        setMap((prev) => ({ ...prev, mode: "Advanced" }))
      }
    },
  })

  const {
    mountStructure: { isMounted },
  } = useMount(() => {
    onInit()
    return () => {
      onRemove()
    }
  }, [])

  const onFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!contentRef.current?.querySelector("form")?.contains(event?.target)) return
    setMap((prev) => ({ ...prev, mode: "Advanced" }))
  }

  useEffect(() => {
    setMap((prev) => ({ ...prev, mode: global.screen.includes("lg") ? "Advanced" : "Simplified" }))
  }, [global.screen])

  return (
    <PanelViewMainContainer
      ref={containerRef}
      tabIndex={0}
      className={`${className}`}
      $isOpened={map.mode === "Advanced"}
      {...restProps}
    >
      <PanelViewMainHandle />
      <PanelViewMainContent ref={contentRef} onFocus={onFocus}>
        {children}
      </PanelViewMainContent>
    </PanelViewMainContainer>
  )
}

interface PanelViewMainStyled {
  $isOpened: boolean
}

const PanelViewMainHandle = styled.span`
  display: none;
  @media ${(props) => props.theme.screen.device.md} {
    display: block;
    padding: 10px 0 16px;
    background: rgb(var(--color-primary600));
    cursor: grab;
    &:after {
      content: "";
      display: block;
      margin: auto;
      width: 36px;
      height: 4px;
      background: rgb(var(--color-neutral100));
      border-radius: 4px;
    }
  }
`

const PanelViewMainContent = styled.div`
  flex: 1 1 0px;
  display: flex;
  flex-direction: column;
`

const PanelViewMainContainer = styled.div<PanelViewMainStyled>`
  flex: none;
  display: flex;
  flex-direction: column;
  width: 385px;
  z-index: 10;
  @media ${(props) => props.theme.screen.device.md} {
    position: fixed;
    top: calc(var(--var, 1vh) * 100);
    left: 0;
    right: 0;
    bottom: calc(var(--var, 1vh) * -100 + 48px + 20px);
    width: auto;
    overflow: hidden;
    transform: translateY(calc(0px - 120px));
    transition: transform 200ms var(--motion-ease-out);
    border-radius: 8px 8px 0 0;
    ${(props) =>
      props.$isOpened &&
      css`
        transform: translateY(calc(var(--var, 1vh) * -100 + 48px + 20px));
      `}
  }
`

export default PanelViewMain
