"use client"

import styled from "styled-components"

export interface MypageViewRowProps extends React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLDivElement>> {
  //
}

const MypageViewRow = (props: MypageViewRowProps) => {
  const { className = "", children, ...restProps } = props

  if (!children) return null

  return (
    <MypageViewRowContainer className={`${className}`} {...restProps}>
      {children}
    </MypageViewRowContainer>
  )
}

const MypageViewRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  &:not(:first-child) {
    margin-top: 16px;
  }
  @media ${(props) => props.theme.screen.device.md} {
    flex-direction: column;
  }
`

export default MypageViewRow