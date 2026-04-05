import MyplaceViewMain, { MyplaceViewMainProps } from "@/components/display/MyplaceView/Main"
import MyplaceViewGroup, { MyplaceViewGroupProps } from "@/components/display/MyplaceView/Group"
import MyplaceViewItem, { MyplaceViewItemProps } from "@/components/display/MyplaceView/Item"

export type { MyplaceViewMainProps, MyplaceViewGroupProps, MyplaceViewItemProps }

export default Object.assign(MyplaceViewMain, {
  Group: MyplaceViewGroup,
  Item: MyplaceViewItem,
})