import MyplaceViewMain, { MyplaceViewMainProps } from "@/components/display/MyplaceView/Main"
import MyplaceViewGroup, { MyplaceViewGroupProps } from "@/components/display/MyplaceView/Group"
import MyplaceViewItem, { MyplaceViewItemProps } from "@/components/display/MyplaceView/Item"
import MyplaceViewFolder, { MyplaceViewFolderProps } from "@/components/display/MyplaceView/Folder"

export type { MyplaceViewMainProps, MyplaceViewGroupProps, MyplaceViewItemProps, MyplaceViewFolderProps }

export default Object.assign(MyplaceViewMain, {
  Group: MyplaceViewGroup,
  Item: MyplaceViewItem,
  Folder: MyplaceViewFolder,
})