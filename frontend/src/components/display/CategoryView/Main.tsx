"use client"

import styled from "styled-components"

export interface CategoryViewMainProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const CategoryViewMain = (props: CategoryViewMainProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <CategoryViewMainContainer className={`${className}`} {...restProps}>
      {children}
    </CategoryViewMainContainer>
  )
}

const CategoryViewMainContainer = styled.div`
  /*  */
`

export default CategoryViewMain