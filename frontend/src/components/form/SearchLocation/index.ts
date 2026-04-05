import { FieldValues } from "react-hook-form"
import SearchLocationMain, { SearchLocationMainProps } from "@/components/form/SearchLocation/Main"
import SearchLocationGroup, { SearchLocationGroupProps } from "@/components/form/SearchLocation/Group"
import SearchLocationItem, { SearchLocationItemProps } from "@/components/form/SearchLocation/Item"

export interface TypeSearchLocation extends FieldValues {
  location: string
  searchKeyword: string
}

export type { SearchLocationMainProps, SearchLocationGroupProps, SearchLocationItemProps }

export default Object.assign(SearchLocationMain, {
  Group: SearchLocationGroup,
  Item: SearchLocationItem,
})
