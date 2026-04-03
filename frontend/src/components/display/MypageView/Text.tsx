"use client"

import { forwardRef } from "react"
import styled from "styled-components"
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "@/types/polymorphic"

export type MypageViewTextProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    //
  }
>

export type MypageViewTextComponent = <C extends React.ElementType = "span">(
  props: MypageViewTextProps<C>,
) => React.ReactNode

const MypageViewText: MypageViewTextComponent = forwardRef(function MypageViewText<
  C extends React.ElementType = "span",
>(props: MypageViewTextProps<C>, ref?: PolymorphicRef<C>): React.ReactNode {
  const { asTag, className = "", children, ...restProps } = props

  return (
    <MypageViewTextContainer ref={ref} as={asTag ?? "span"} className={`${className}`} {...restProps}>
      {children}
    </MypageViewTextContainer>
  )
})

const MypageViewTextContainer = styled.span`
  display: block;
  color: rgb(var(--color-neutral700));
`

export default MypageViewText