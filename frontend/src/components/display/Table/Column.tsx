"use client"

import { forwardRef } from "react"
import styled from "styled-components"
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "@/types/polymorphic"

export type TableColumnProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    //
  }
>

export type TableColumnComponent = <C extends React.ElementType = "td">(props: TableColumnProps<C>) => React.ReactNode

const TableColumn: TableColumnComponent = forwardRef(function TableColumn<C extends React.ElementType = "td">(
  props: TableColumnProps<C>,
  ref?: PolymorphicRef<C>,
): React.ReactNode {
  const { asTag, className = "", children, ...restProps } = props

  return (
    <TableColumnContainer ref={ref} as={asTag ?? "td"} className={`${className}`} {...restProps}>
      {children}
    </TableColumnContainer>
  )
})

const TableColumnContainer = styled.td`
  padding: 8px 16px;
  &:is(th) {
    background-color: rgb(var(--color-neutral300));
  }
`

export default TableColumn
