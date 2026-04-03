"use client"

import styled from "styled-components"

export interface MypageViewMessageProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const MypageViewMessage = (props: MypageViewMessageProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <MypageViewMessageContainer className={`${className}`} {...restProps}>
      {children}
    </MypageViewMessageContainer>
  )
}

const MypageViewMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 0;
  text-align: center;
  strong {
    display: block;
    font-size: ${(props) => props.theme.typo.size.base};
    line-height: ${(props) => props.theme.typo.leading.base};
    font-weight: 500;
    em {
      color: rgb(var(--color-primary600));
    }
  }
  span {
    margin-top: 4px;
    color: rgb(var(--color-neutral800));
  }
  a,
  button {
    margin-top: 12px;
  }
`

export default MypageViewMessage