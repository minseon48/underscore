"use client"

import styled from "styled-components"

export interface AuthViewActionProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const AuthViewAction = (props: AuthViewActionProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <AuthViewActionContainer className={`${className}`} {...restProps}>
      {children}
    </AuthViewActionContainer>
  )
}

const AuthViewActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export default AuthViewAction