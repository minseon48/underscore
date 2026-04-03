"use client"

import styled from "styled-components"
import TableRow from "@/components/display/Table/Row"
import TableColumn from "@/components/display/Table/Column"

type Column<T extends Record<string, unknown>> = {
  key: string
  title: string
  dataIndex?: keyof T
  render?: (text: string, record: RowData<T>) => React.ReactNode
}

type RowData<T extends Record<string, unknown>> = {
  [key in keyof T]: T[key]
} & {
  key: string
}

export interface TableMainProps<T extends Record<string, unknown>> extends React.HTMLAttributes<HTMLDivElement> {
  columns: Column<T>[]
  data: RowData<T>[]
}

const TableMain = <T extends Record<string, unknown>>(props: TableMainProps<T>) => {
  const { data, columns, className = "", ...restProps } = props

  return (
    <TableMainContainer className={`${className}`} {...restProps}>
      <table>
        <thead>
          <TableRow>
            {columns.map((column) => (
              <TableColumn asTag="th" key={column.key}>
                {column.title}
              </TableColumn>
            ))}
          </TableRow>
        </thead>
        <tbody>
          {data.map((row) => (
            <TableRow key={row.key}>
              {columns.map((column) => (
                <TableColumn asTag="td" key={`${row.key}-${column.key}`}>
                  {column.render
                    ? column.render(`${row[column.dataIndex ?? column.key]}`, row)
                    : `${row[column.dataIndex ?? column.key]}`}
                </TableColumn>
              ))}
            </TableRow>
          ))}
        </tbody>
      </table>
    </TableMainContainer>
  )
}

const TableMainContainer = styled.div`
  width: 100%;
  border-top: 1px solid rgb(var(--color-neutral500));
  border-bottom: 1px solid rgb(var(--color-neutral500));
  tbody {
    border-top: 1px solid rgb(var(--color-neutral500));
  }
`

export default TableMain
