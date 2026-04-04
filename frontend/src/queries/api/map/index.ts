import { locationMapKey } from "@/queries/api/map/location/type"
import { categoryMapKey } from "@/queries/api/map/category/type"
import { businessMapKey } from "@/queries/api/map/business/type"
import { analysisMapKey } from "@/queries/api/map/analysis/type"

export type { TypeLocationListAllId, TypeLocationListAllFilter } from "@/queries/api/map/location/type"
export type { TypeCategoryListAllId, TypeCategoryListAllFilter } from "@/queries/api/map/category/type"
export { TypeCategoryCode } from "@/components/form/SearchCategory/type"
export type { TypeBusinessListAllId } from "@/queries/api/map/business/type"
export type { TypeAnalysisListAllFilter, TypeAnalysisListAllId } from "@/queries/api/map/analysis/type"

export const mapKey = {
  location: locationMapKey,
  category: categoryMapKey,
  business: businessMapKey,
  analysis: analysisMapKey,
}
