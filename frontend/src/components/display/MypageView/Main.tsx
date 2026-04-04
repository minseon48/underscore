"use client"

import styled from "styled-components"

export interface MypageViewMainProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  //
}

const MypageViewMain = (props: MypageViewMainProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <MypageViewMainContainer className={`${className}`} {...restProps}>
      {children}
    </MypageViewMainContainer>
  )
}

const MypageViewMainContainer = styled.section`
  //
`

export default MypageViewMain