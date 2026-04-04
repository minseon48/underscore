import { FieldValues } from "react-hook-form"
import SearchBusinessMain, { SearchBusinessMainProps } from "@/components/form/SearchBusiness/Main"

export interface TypeSearchBusiness extends FieldValues {
  page: number
  business: string
  businessCode: string
}

export type { SearchBusinessMainProps }

export default Object.assign(SearchBusinessMain, {
  //
})
