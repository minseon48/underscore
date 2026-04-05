import FormHocMain, { FormHocMainProps } from "@/components/entry/FormHoc/Main"
import FormHocRow, { FormHocRowProps } from "@/components/entry/FormHoc/Row"
import FormHocGroup, { FormHocGroupProps } from "@/components/entry/FormHoc/Group"
import FormHocAction, { FormHocActionProps } from "@/components/entry/FormHoc/Action"

export type { FormHocMainProps, FormHocRowProps, FormHocGroupProps, FormHocActionProps }

export default Object.assign(FormHocMain, {
  Row: FormHocRow,
  Group: FormHocGroup,
  Action: FormHocAction,
})
