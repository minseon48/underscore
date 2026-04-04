"use client"

import { useEffect, useMemo } from "react"
import { useRecoilState } from "recoil"
import styled from "styled-components"
import useMount from "@/libs/hook/useMount"
import useResize from "@/libs/hook/useResize"
import { ObjectEntries } from "@/libs/utils"
import { atomGlobal } from "@/stores/global"
import { ScreenSize, screenSize } from "@/styles/theme/screen"

export interface LayoutMainProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const LayoutMain = (props: LayoutMainProps) => {
  const { className = "", children, ...restProps } = props

  const [global, setGlobal] = useRecoilState(atomGlobal)

  const {
    resizeStructure: { windowInnerWidth, windowInnerHeight },
    onUpdate,
    onRemove,
  } = useResize()

  const {
    mountStructure: { isMounted },
  } = useMount(() => {
    onUpdate()
    return () => {
      onRemove()
    }
  }, [])

  const currentScreen = useMemo<(keyof ScreenSize)[]>(() => {
    const result = [] as (keyof ScreenSize)[]
    const sizes = Object.entries(screenSize) as ObjectEntries<typeof screenSize>
    sizes.sort(([, a], [, b]) => parseInt(a) - parseInt(b))
    if (windowInnerWidth === 0) {
      return result
    }
    for (const [key, value] of sizes) {
      result.push(key)
      if (windowInnerWidth <= parseInt(value)) break
    }
    return result
  }, [windowInnerWidth])

  useEffect(() => {
    if (JSON.stringify(global.screen) === JSON.stringify(currentScreen)) return
    setGlobal((prev) => ({ ...prev, screen: currentScreen }))
  }, [currentScreen, global.screen, setGlobal])

  useEffect(() => {
    const screenHeight = windowInnerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${screenHeight}px`)
  }, [windowInnerHeight])

  return (
    <LayoutMainContainer className={`${className}`} {...restProps}>
      {children}
    </LayoutMainContainer>
  )
}

const LayoutMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(var(--var, 1vh) * 100);
`

export default LayoutMain