"use client"

import styled from "styled-components"

export interface AnalysisViewMainProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const AnalysisViewMain = (props: AnalysisViewMainProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <AnalysisViewMainContainer className={`${className}`} {...restProps}>
      {children}
    </AnalysisViewMainContainer>
  )
}

const AnalysisViewMainContainer = styled.div`
  /*  */
`

export default AnalysisViewMain