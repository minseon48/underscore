import { profileKey } from "@/queries/api/user/profile/type"
import { myplaceKey } from "@/queries/api/user/myplace/type"
import { membershipKey } from "@/queries/api/user/membership/type"
import { paymentKey } from "@/queries/api/user/payment/type"

export type { TypeMyplaceListAllId, TypeMyplaceListAllFilter } from "@/queries/api/user/myplace/type"
export type { TypeMyplaceDetailDefaultId } from "@/queries/api/user/myplace/type"
export type {
  TypePaymentListAllId,
  TypePaymentListAllFilter,
  TypePaymentDetailId,
} from "@/queries/api/user/payment/type"

export const userKey = {
  profile: profileKey,
  myplace: myplaceKey,
  membership: membershipKey,
  payment: paymentKey,
}
