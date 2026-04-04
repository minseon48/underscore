"use client"

import { Children } from "react"
import styled from "styled-components"

export interface MyplaceViewGroupProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>> {
  //
}

const MyplaceViewGroup = (props: MyplaceViewGroupProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <MyplaceViewGroupContainer className={`${className}`} {...restProps}>
      {Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </MyplaceViewGroupContainer>
  )
}

const MyplaceViewGroupContainer = styled.ul`
  li + li {
    border-top: 1px solid rgb(var(--color-neutral400));
  }
`

export default MyplaceViewGroup