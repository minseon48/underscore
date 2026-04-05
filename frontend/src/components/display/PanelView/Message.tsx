"use client"

import styled from "styled-components"

export interface PanelViewMessageProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

const PanelViewMessage = (props: PanelViewMessageProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <PanelViewMessageContainer className={`${className}`} {...restProps}>
      {children}
    </PanelViewMessageContainer>
  )
}

const PanelViewMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 0;
  padding: 0 20px;
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

export default PanelViewMessage