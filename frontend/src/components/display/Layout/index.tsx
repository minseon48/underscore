import LayoutMain, { LayoutMainProps } from "@/components/display/Layout/Main"
import LayoutHeader, { LayoutHeaderProps } from "@/components/display/Layout/Header"
import LayoutNavigation, { LayoutNavigationProps } from "@/components/display/Layout/Navigation"
import LayoutContent, { LayoutContentProps } from "@/components/display/Layout/Content"

export type { LayoutMainProps, LayoutHeaderProps, LayoutNavigationProps, LayoutContentProps }

export default Object.assign(LayoutMain, {
  Header: LayoutHeader,
  Navigation: LayoutNavigation,
  Content: LayoutContent,
})