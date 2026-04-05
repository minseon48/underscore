"use client"

import styled from "styled-components"

export interface MypageViewHeaderProps extends React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLDivElement>> {
  //
}

const MypageViewHeader = (props: MypageViewHeaderProps) => {
  const { className = "", children, ...restProps } = props

  if (!children) return null

  return (
    <MypageViewHeaderContainer className={`${className}`} {...restProps}>
      {children}
    </MypageViewHeaderContainer>
  )
}

const MypageViewHeaderContainer = styled.div`
  h2,
  h3,
  h4 {
    font-size: ${(props) => props.theme.typo.size.lg};
    line-height: ${(props) => props.theme.typo.leading.lg};
    font-weight: 500;
  }
  &:not(:first-child) {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgb(var(--color-neutral400));
  }
`

export default MypageViewHeader