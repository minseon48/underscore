"use client"

import { useState } from "react"
import { useServerInsertedHTML } from "next/navigation"
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components"
import useMount from "@/libs/hook/useMount"
import { theme } from "@/styles/theme"
import Global from "@/styles/global"

export interface StyledProviderMainProps extends React.PropsWithChildren {
  //
}

const StyledProviderMain = (props: StyledProviderMainProps) => {
  const { children } = props

  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  const {
    mountStructure: { isMounted },
  } = useMount()

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (isMounted)
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    )

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <ThemeProvider theme={theme}>
        <Global />
        {children}
      </ThemeProvider>
    </StyleSheetManager>
  )
}

export default StyledProviderMain
