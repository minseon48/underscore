import ChecklistViewBoard, { ChecklistViewBoardProps } from "@/components/display/ChecklistView/Board"
import ChecklistViewComposer from "@/components/display/ChecklistView/Composer"
import ChecklistViewTreeItem from "@/components/display/ChecklistView/TreeItem"
import ChecklistViewDetailItem from "@/components/display/ChecklistView/DetailItem"

export type { ChecklistViewBoardProps }

export default Object.assign(
    {},
    {
        Board: ChecklistViewBoard,
        Composer: ChecklistViewComposer,
        TreeItem: ChecklistViewTreeItem,
        DetailItem: ChecklistViewDetailItem,
        },
    )