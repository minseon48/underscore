import { FieldValues } from "react-hook-form"
import SearchPaymentMain, { SearchPaymentMainProps } from "@/components/form/SearchPayment/Main"
import {
  TypePaymentStateCode,
  TypePaymentPeriodCode,
  PaymentPeriodOptionGroups,
  PaymentStateOptionGroups,
} from "@/components/form/SearchPayment/type"

export interface TypeSearchPayment extends FieldValues {
  page: number
  size: number
  isFiltered: boolean
  paymentStateCode: TypePaymentStateCode
  paymentPeriodCode: TypePaymentPeriodCode
  startDate?: Date
  endDate?: Date
  searchPaymentStateCode: TypePaymentStateCode
  searchPaymentPeriodCode: TypePaymentPeriodCode
  searchStartDate?: Date
  searchEndDate?: Date
}

export { TypePaymentStateCode, TypePaymentPeriodCode, PaymentPeriodOptionGroups, PaymentStateOptionGroups }
export type { SearchPaymentMainProps }

export default Object.assign(SearchPaymentMain, {
  //
})
