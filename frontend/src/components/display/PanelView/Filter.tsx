"use client"

import styled, { css } from "styled-components"

export interface PanelViewFilterProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const PanelViewFilter = (props: PanelViewFilterProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <PanelViewFilterContainer className={`${className}`} {...restProps}>
      {children}
    </PanelViewFilterContainer>
  )
}

const PanelViewFilterContainer = styled.div`
  position: relative;
  padding: 12px 20px;
  background: rgb(var(--color-neutral100));
  z-index: 10;
`

export default PanelViewFilter