import { SelectShape } from "@/components/entry/Select/type"
import SelectMain, { SelectMainProps } from "@/components/entry/Select/Main"
import SelectGroup, { SelectGroupProps } from "@/components/entry/Select/Group"
import SelectLabel, { SelectLabelProps } from "@/components/entry/Select/Label"
import SelectItem, { SelectItemProps } from "@/components/entry/Select/Item"

export type { SelectShape, SelectMainProps, SelectGroupProps, SelectLabelProps, SelectItemProps }

export default Object.assign(SelectMain, {
  Group: SelectGroup,
  Label: SelectLabel,
  Item: SelectItem,
})
