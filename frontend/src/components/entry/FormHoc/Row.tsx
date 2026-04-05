"use client"

import styled from "styled-components"

export interface FormHocRowProps extends React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLDivElement>> {
  //
}

const FormHocRow = (props: FormHocRowProps) => {
  const { className = "", children, ...restProps } = props

  if (!children) return null

  return (
    <FormHocRowContainer className={`${className}`} {...restProps}>
      {children}
    </FormHocRowContainer>
  )
}

const FormHocRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  &:not(:first-child) {
    margin-top: 12px;
  }
  @media ${(props) => props.theme.screen.device.md} {
    flex-direction: column;
  }
`

export default FormHocRow
