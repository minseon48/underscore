"use client"

import { forwardRef } from "react"
import styled from "styled-components"
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "@/types/polymorphic"

export type MypageViewLabelProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    //
  }
>

export type MypageViewLabelComponent = <C extends React.ElementType = "strong">(
  props: MypageViewLabelProps<C>,
) => React.ReactNode

const MypageViewLabel: MypageViewLabelComponent = forwardRef(function MypageViewLabel<
  C extends React.ElementType = "strong",
>(props: MypageViewLabelProps<C>, ref?: PolymorphicRef<C>): React.ReactNode {
  const { asTag, className = "", children, ...restProps } = props

  return (
    <MypageViewLabelContainer ref={ref} as={asTag ?? "strong"} className={`${className}`} {...restProps}>
      {children}
    </MypageViewLabelContainer>
  )
})

const MypageViewLabelContainer = styled.strong`
  display: block;
  font-size: ${(props) => props.theme.typo.size.base};
  line-height: ${(props) => props.theme.typo.leading.base};
  font-weight: 500;
`

export default MypageViewLabel