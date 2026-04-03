"use client"

import { Children } from "react"
import styled from "styled-components"

export interface CategoryViewGroupProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>> {
  //
}

const CategoryViewGroup = (props: CategoryViewGroupProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <CategoryViewGroupContainer className={`${className}`} {...restProps}>
      {Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </CategoryViewGroupContainer>
  )
}

const CategoryViewGroupContainer = styled.ul`
  li + li {
    border-top: 1px solid rgb(var(--color-neutral400));
  }
`

export default CategoryViewGroup