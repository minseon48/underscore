"use client"

import styled from "styled-components"

export interface TableRowProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLTableRowElement>> {
  //
}

const TableRow = <T extends Record<string, unknown>>(props: TableRowProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <TableRowContainer className={`${className}`} {...restProps}>
      {children}
    </TableRowContainer>
  )
}

const TableRowContainer = styled.tr`
  & + & {
    border-top: 1px solid rgb(var(--color-neutral500));
  }
`

export default TableRow
