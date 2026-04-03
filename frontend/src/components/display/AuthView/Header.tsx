"use client"

import styled from "styled-components"

export interface AuthViewHeaderProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const AuthViewHeader = (props: AuthViewHeaderProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <AuthViewHeaderContainer className={`${className}`} {...restProps}>
      {children}
    </AuthViewHeaderContainer>
  )
}

const AuthViewHeaderContainer = styled.div`
  text-align: center;
  h2,
  h3,
  h4 {
    font-size: ${(props) => props.theme.typo.size["2xl"]};
    line-height: ${(props) => props.theme.typo.leading["2xl"]};
  }
  p {
    margin-top: 8px;
  }
  .text-primary {
    color: rgb(var(--color-primary600));
  }
`

export default AuthViewHeader