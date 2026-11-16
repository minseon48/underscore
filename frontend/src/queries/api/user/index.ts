import { profileKey } from "@/queries/api/user/profile/type"
import { myplaceKey } from "@/queries/api/user/myplace/type"
import { membershipKey } from "@/queries/api/user/membership/type"
import { paymentKey } from "@/queries/api/user/payment/type"
import { checklistKey } from"@/queries/api/user/checklist/type"
import { supportKey } from "@/queries/api/user/support/type"

export type { TypeMyplaceListAllId, TypeMyplaceListAllFilter } from "@/queries/api/user/myplace/type"
export type { TypeMyplaceDetailDefaultId } from "@/queries/api/user/myplace/type"
export type {
  TypePaymentListAllId,
  TypePaymentListAllFilter,
  TypePaymentDetailId,
} from "@/queries/api/user/payment/type"
export type {
  TypeSupportListAllId,
  TypeSupportListAllFilter,
} from "@/queries/api/user/support/type"

export const userKey = {
  profile: profileKey,
  myplace: myplaceKey,
  membership: membershipKey,
  payment: paymentKey,
  checklist: checklistKey,
  support: supportKey,
}
