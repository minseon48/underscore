"use client"

import styled from "styled-components"

export interface MypageViewActionProps extends React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLDivElement>> {
  //
}

const MypageViewAction = (props: MypageViewActionProps) => {
  const { className = "", children, ...restProps } = props

  if (!children) return null

  return (
    <MypageViewActionContainer className={`${className}`} {...restProps}>
      {children}
    </MypageViewActionContainer>
  )
}

const MypageViewActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  &:not(:first-child) {
    margin-top: 16px;
  }
`

export default MypageViewAction