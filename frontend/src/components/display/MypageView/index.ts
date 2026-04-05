import MypageViewMain, { MypageViewMainProps } from "@/components/display/MypageView/Main"
import MypageViewHeader, { MypageViewHeaderProps } from "@/components/display/MypageView/Header"
import MypageViewRow, { MypageViewRowProps } from "@/components/display/MypageView/Row"
import MypageViewGroup, { MypageViewGroupProps } from "@/components/display/MypageView/Group"
import MypageViewMessage, { MypageViewMessageProps } from "@/components/display/MypageView/Message"
import MypageViewLabel, { MypageViewLabelProps } from "@/components/display/MypageView/Label"
import MypageViewText, { MypageViewTextProps } from "@/components/display/MypageView/Text"
import MypageViewAction, { MypageViewActionProps } from "@/components/display/MypageView/Action"

export type {
  MypageViewMainProps,
  MypageViewHeaderProps,
  MypageViewRowProps,
  MypageViewGroupProps,
  MypageViewMessageProps,
  MypageViewLabelProps,
  MypageViewTextProps,
  MypageViewActionProps,
}

export default Object.assign(MypageViewMain, {
  Header: MypageViewHeader,
  Row: MypageViewRow,
  Group: MypageViewGroup,
  Message: MypageViewMessage,
  Label: MypageViewLabel,
  Text: MypageViewText,
  Action: MypageViewAction,
})