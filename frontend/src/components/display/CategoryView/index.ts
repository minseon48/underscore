import CategoryViewMain, { CategoryViewMainProps } from "@/components/display/CategoryView/Main"
import CategoryViewGroup, { CategoryViewGroupProps } from "@/components/display/CategoryView/Group"
import CategoryViewItem, { CategoryViewItemProps } from "@/components/display/CategoryView/item.tsx"

export type { CategoryViewMainProps, CategoryViewGroupProps, CategoryViewItemProps }

export default Object.assign(CategoryViewMain, {
  Group: CategoryViewGroup,
  Item: CategoryViewItem,
})