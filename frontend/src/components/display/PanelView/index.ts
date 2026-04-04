import PanelViewMain, { PanelViewMainProps } from "@/components/display/PanelView/Main"
import PanelViewHeader, { PanelViewHeaderProps } from "@/components/display/PanelView/Header"
import PanelViewFilter, { PanelViewFilterProps } from "@/components/display/PanelView/Filter"
import PanelViewSubject, { PanelViewSubjectProps } from "@/components/display/PanelView/Subject"
import PanelViewNavigation, { PanelViewNavigationProps } from "@/components/display/PanelView/Navigation"
import PanelViewMessage, { PanelViewMessageProps } from "@/components/display/PanelView/Message"
import { PanelViewSubjectStatusCode } from "@/components/display/PanelView/type"

export { PanelViewSubjectStatusCode }
export type {
  PanelViewMainProps,
  PanelViewHeaderProps,
  PanelViewFilterProps,
  PanelViewSubjectProps,
  PanelViewNavigationProps,
  PanelViewMessageProps,
}

export default Object.assign(PanelViewMain, {
  Header: PanelViewHeader,
  Filter: PanelViewFilter,
  Subject: PanelViewSubject,
  Navigation: PanelViewNavigation,
  Message: PanelViewMessage,
})
