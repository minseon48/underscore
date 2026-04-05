import RadioMain, { RadioMainProps } from "@/components/entry/Radio/Main"
import RadioItem, { RadioItemProps } from "@/components/entry/Radio/Item"

export type { RadioMainProps, RadioItemProps }

export default Object.assign(RadioMain, {
  Item: RadioItem,
})
