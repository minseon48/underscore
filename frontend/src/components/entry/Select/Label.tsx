"use client"

import styled from "styled-components"

export interface SelectLabelProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>> {
  //
}

const SelectLabel = (props: SelectLabelProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <SelectLabelContainer className={`${className}`} {...restProps}>
      {children}
    </SelectLabelContainer>
  )
}

const SelectLabelContainer = styled.span`
  display: block;
  width: 100%;
  padding: 5px 8px;
  text-align: left;
  color: rgb(var(--color-neutral800));
`

export default SelectLabel
