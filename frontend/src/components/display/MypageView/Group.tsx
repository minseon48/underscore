"use client"

import styled, { css } from "styled-components"
import { NonUndefined } from "@/libs/utils"

export interface MypageViewGroupProps extends React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLDivElement>> {
  column?: number
}

const MypageViewGroup = (props: MypageViewGroupProps) => {
  const { column, className = "", children, ...restProps } = props

  if (!children) return null

  return (
    <MypageViewGroupContainer className={`${className}`} $column={column ?? 0} {...restProps}>
      {children}
    </MypageViewGroupContainer>
  )
}

interface MypageViewGroupStyled {
  $column: NonUndefined<MypageViewGroupProps["column"]>
}

const MypageViewGroupContainer = styled.div<MypageViewGroupStyled>`
  flex: 1 1 0px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
  ${(props) =>
    props.$column &&
    css`
      max-width: ${100 / props.$column}%;
    `}
`

export default MypageViewGroup