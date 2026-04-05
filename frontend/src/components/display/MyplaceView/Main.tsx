"use client"

import styled from "styled-components"

export interface MyplaceViewMainProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const MyplaceViewMain = (props: MyplaceViewMainProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <MyplaceViewMainContainer className={`${className}`} {...restProps}>
      {children}
    </MyplaceViewMainContainer>
  )
}

const MyplaceViewMainContainer = styled.div`
  /*  */
`

export default MyplaceViewMain