"use client"

import { Children } from "react"
import styled from "styled-components"

export interface SelectGroupProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>> {
  //
}

const SelectGroup = (props: SelectGroupProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <SelectGroupContainer className={`${className}`} {...restProps}>
      {Children.map(children, (child) => (
        <li role="presentation">{child}</li>
      ))}
    </SelectGroupContainer>
  )
}

const SelectGroupContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
`

export default SelectGroup
