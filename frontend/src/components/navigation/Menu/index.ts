import MenuMain, { MenuMainProps } from "@/components/navigation/Menu/Main"
import MenuGroup, { MenuGroupProps } from "@/components/navigation/Menu/Group"
import MenuItem, { MenuItemProps } from "@/components/navigation/Menu/Item"

export type { MenuMainProps, MenuGroupProps, MenuItemProps }

export default Object.assign(MenuMain, {
  Group: MenuGroup,
  Item: MenuItem,
})
