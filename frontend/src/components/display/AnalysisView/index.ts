import AnalysisViewMain, { AnalysisViewMainProps } from "@/components/display/AnalysisView/Main"
import AnalysisViewGroup, { AnalysisViewGroupProps } from "@/components/display/AnalysisView/Group"
import AnalysisViewItem, { AnalysisViewItemProps } from "@/components/display/AnalysisView/Item"

export type { AnalysisViewMainProps, AnalysisViewGroupProps, AnalysisViewItemProps }

export default Object.assign(AnalysisViewMain, {
  Group: AnalysisViewGroup,
  Item: AnalysisViewItem,
})
