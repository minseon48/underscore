"use client"

import styled from "styled-components"

export interface FormHocGroupProps extends React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLDivElement>> {
  //
}

const FormHocGroup = (props: FormHocGroupProps) => {
  const { className = "", children, ...restProps } = props

  if (!children) return null

  return (
    <FormHocGroupContainer className={`${className}`} {...restProps}>
      {children}
    </FormHocGroupContainer>
  )
}

const FormHocGroupContainer = styled.div`
  flex: 1 1 0px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
`

export default FormHocGroup