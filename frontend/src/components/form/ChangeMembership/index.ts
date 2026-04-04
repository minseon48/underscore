import { FieldValues } from "react-hook-form"
import ChangeMembershipMain, { ChangeMembershipMainProps } from "@/components/form/ChangeMembership/Main"
import { TypeSubscriptionCode } from "@/components/form/ChangeMembership/type"

export interface TypeChangeMembership extends FieldValues {
  subscription: string
  subscriptionCode: TypeSubscriptionCode
}

export type { ChangeMembershipMainProps }

export default Object.assign(ChangeMembershipMain, {
  //
})
