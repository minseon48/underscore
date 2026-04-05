import TableMain, { TableMainProps } from "@/components/display/Table/Main"
import TableRow, { TableRowProps } from "@/components/display/Table/Row"
import TableColumn, { TableColumnProps } from "@/components/display/Table/Column"

export type { TableMainProps, TableRowProps, TableColumnProps }

export default Object.assign(TableMain, {
  Row: TableRow,
  Column: TableColumn,
})
