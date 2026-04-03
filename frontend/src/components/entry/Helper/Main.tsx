"use client"

import styled, { css } from "styled-components"
import { NonUndefined } from "@/libs/utils"
import { HelperVariants } from "@/components/entry/Helper/type"

export interface HelperMainProps extends React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLDivElement>> {
  variants?: HelperVariants
}

const HelperMain = (props: HelperMainProps) => {
  const { variants = HelperVariants.Default, className = "", children, ...restProps } = props

  if (!children) return null

  return (
    <HelperMainContainer className={`${className}`} $variants={variants} {...restProps}>
      {children}
    </HelperMainContainer>
  )
}

interface HelperMainStyled {
  $variants: NonUndefined<HelperMainProps["variants"]>
}

const HelperMainContainer = styled.div<HelperMainStyled>`
  font-size: ${({ theme }) => theme.typo.size.xs};
  line-height: ${({ theme }) => theme.typo.leading.xs};
  /* color */
  ${(props) => {
    switch (props.$variants) {
      case HelperVariants.Error:
        return css`
          color: rgb(var(--color-red500));
        `
      case HelperVariants.Default:
      default:
        return css`
          color: rgb(var(--color-neutral700));
        `
    }
  }}
`

export default HelperMain
