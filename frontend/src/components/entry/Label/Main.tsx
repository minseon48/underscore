"use client"

import { forwardRef } from "react"
import styled from "styled-components"
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "@/types/polymorphic"
import { LabelNecessity } from "@/components/entry/Label/type"

export type LabelMainProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    necessity?: LabelNecessity
    isRequired?: boolean
  }
>

export type LabelMainComponent = <C extends React.ElementType = "label">(props: LabelMainProps<C>) => React.ReactNode

const LabelMain: LabelMainComponent = forwardRef(function LabelMain<C extends React.ElementType = "label">(
  props: LabelMainProps<C>,
  ref?: PolymorphicRef<C>,
): React.ReactNode {
  const { asTag, necessity = LabelNecessity.Icon, isRequired = false, className = "", children, ...restProps } = props

  return (
    <LabelMainContainer ref={ref} as={asTag ?? "label"} className={`${className}`} {...restProps}>
      {children}
      {necessity === LabelNecessity.Icon && isRequired && (
        <Required>
          <em className="asterisk" aria-hidden="true"></em>
          <em className="sr-only">(필수)</em>
        </Required>
      )}
      {necessity === LabelNecessity.Text && !isRequired && (
        <Required>
          <em>(선택)</em>
        </Required>
      )}
    </LabelMainContainer>
  )
})

const Required = styled.span`
  .asterisk:before {
    content: "*";
    font-size: 1em;
    line-height: ${({ theme }) => theme.typo.leading.none};
    color: rgb(var(--color-red500));
    vertical-align: middle;
  }
`

const LabelMainContainer = styled.label`
  display: block;
  ${Required} {
    margin-left: 2px;
  }
`

export default LabelMain
