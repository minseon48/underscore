"use client"

import { Children } from "react"
import styled from "styled-components"

export interface AnalysisViewGroupProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>> {
  //
}

const AnalysisViewGroup = (props: AnalysisViewGroupProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <AnalysisViewGroupContainer className={`${className}`} {...restProps}>
      {Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </AnalysisViewGroupContainer>
  )
}

const AnalysisViewGroupContainer = styled.ul`
  li + li {
    border-top: 1px solid rgb(var(--color-neutral400));
  }
`

export default AnalysisViewGroup
