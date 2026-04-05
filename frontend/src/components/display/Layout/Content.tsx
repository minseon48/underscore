"use client"

import styled from "styled-components"

export interface LayoutContentProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const LayoutContent = (props: LayoutContentProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <LayoutContentContainer className={`${className}`} {...restProps}>
      {children}
    </LayoutContentContainer>
  )
}

const LayoutContentContainer = styled.main`
  /*  */
`

export default LayoutContent