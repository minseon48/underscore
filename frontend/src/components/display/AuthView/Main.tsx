"use client"

import styled from "styled-components"

export interface AuthViewMainProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const AuthViewMain = (props: AuthViewMainProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <AuthViewMainContainer className={`${className}`} {...restProps}>
      {children}
    </AuthViewMainContainer>
  )
}

const AuthViewMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

export default AuthViewMain
