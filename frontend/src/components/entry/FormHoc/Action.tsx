"use client"

import styled from "styled-components"

export interface FormHocActionProps extends React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLDivElement>> {
  //
}

const FormHocAction = (props: FormHocActionProps) => {
  const { className = "", children, ...restProps } = props

  if (!children) return null

  return (
    <FormHocActionContainer className={`${className}`} {...restProps}>
      {children}
    </FormHocActionContainer>
  )
}

const FormHocActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  &:not(:first-child) {
    margin-top: 16px;
  }
`

export default FormHocAction
