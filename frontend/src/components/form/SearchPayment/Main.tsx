"use client"

import { FieldValues } from "react-hook-form"
import styled from "styled-components"
import { convertDateToString } from "@/libs/utils"
import FormHoc, { FormHocMainProps } from "@/components/entry/FormHoc"
import { TypePaymentPeriodCode, TypePaymentStateCode, TypeSearchPayment } from "@/components/form/SearchPayment"
import Icon from "@/components/general/Icon"
import Label from "@/components/entry/Label"
import Input from "@/components/entry/Input"
import Button from "@/components/general/Button"
import Select from "@/components/entry/Select"

export interface SearchPaymentMainProps<T extends FieldValues = TypeSearchPayment> extends FormHocMainProps<T> {
  //
}

const SearchPaymentMain = FormHoc<TypeSearchPayment>((props: SearchPaymentMainProps) => {
  const { formAction, formData, formPlaceholder, formOptionGroups, children, handleValid, ...restProps } = props

  const { control, handleSubmit, formState, setValue, watch } = formData

  const onReset = () => {
    setValue("page", 1)
    setValue("isFiltered", false)
    setValue("paymentStateCode", TypePaymentStateCode["All"])
    setValue("paymentPeriodCode", TypePaymentPeriodCode["All"])
    setValue("startDate", "" as unknown as Date)
    setValue("endDate", "" as unknown as Date)
  }

  return (
    <SearchPaymentMainContainer id="search-payment" onSubmit={handleSubmit(handleValid)} noValidate {...restProps}>
      <FormHoc.Row>
        <FormHoc.Group>
          <Label asTag="label" htmlFor="paymentStateCode">
            결제상태
          </Label>
          <Select<TypeSearchPayment>
            control={control}
            name="paymentStateCode"
            rules={{}}
            multiple={false}
            shape="square"
            title={`${formPlaceholder?.paymentStateCode} 선택`}
            placeholder={formPlaceholder?.paymentStateCode ?? ""}
            optionGroups={formOptionGroups?.paymentStateCode ?? []}
          />
        </FormHoc.Group>
        <FormHoc.Group>
          <Label asTag="label" htmlFor="paymentPeriodCode">
            조회기간
          </Label>
          <Select<TypeSearchPayment>
            control={control}
            name="paymentPeriodCode"
            rules={{}}
            multiple={false}
            shape="square"
            title={`${formPlaceholder?.paymentPeriodCode} 선택`}
            placeholder={formPlaceholder?.paymentPeriodCode ?? ""}
            optionGroups={formOptionGroups?.paymentPeriodCode ?? []}
            onSelected={([option]) => {
              // TODO
              const startDate = new Date()
              const endDate = new Date(startDate)
              const currentMonth = startDate.getMonth()
              switch (option.value) {
                case TypePaymentPeriodCode["All"]:
                  setValue("startDate", "" as unknown as Date)
                  setValue("endDate", "" as unknown as Date)
                  break
                case TypePaymentPeriodCode["1M"]:
                  setValue(
                    "startDate",
                    convertDateToString(new Date(startDate.setDate(currentMonth - 1))) as unknown as Date,
                  )
                  setValue("endDate", convertDateToString(endDate) as unknown as Date)
                  break
                case TypePaymentPeriodCode["3M"]:
                  setValue(
                    "startDate",
                    convertDateToString(new Date(startDate.setDate(currentMonth - 3))) as unknown as Date,
                  )
                  setValue("endDate", convertDateToString(endDate) as unknown as Date)
                  break
                case TypePaymentPeriodCode["6M"]:
                  setValue(
                    "startDate",
                    convertDateToString(new Date(startDate.setDate(currentMonth - 6))) as unknown as Date,
                  )
                  setValue("endDate", convertDateToString(endDate) as unknown as Date)
                  break
                case TypePaymentPeriodCode["12M"]:
                  setValue(
                    "startDate",
                    convertDateToString(new Date(startDate.setDate(currentMonth - 12))) as unknown as Date,
                  )
                  setValue("endDate", convertDateToString(endDate) as unknown as Date)
                  break
                case TypePaymentPeriodCode["Custom"]:
                  setValue("startDate", "" as unknown as Date)
                  setValue("endDate", "" as unknown as Date)
                  break
                // default:
                //   break;
              }
            }}
          />
        </FormHoc.Group>
        <FormHoc.Group>
          <Label asTag="label" htmlFor="startDate">
            시작일
          </Label>
          {/* TODO */}
          <Input<TypeSearchPayment>
            control={control}
            name="startDate"
            rules={{
              required: {
                value: watch("paymentPeriodCode") === TypePaymentPeriodCode["Custom"],
                message: "시작일을 입력해주세요",
              },
            }}
            type="date"
            placeholder={formPlaceholder?.startDate}
            disabled={watch("paymentPeriodCode") !== TypePaymentPeriodCode["Custom"]}
            prefixEl={<Icon name="Calendar" aria-hidden={true} />}
          />
        </FormHoc.Group>
        <FormHoc.Group>
          <Label asTag="label" htmlFor="endDate">
            종료일
          </Label>
          {/* TODO */}
          <Input<TypeSearchPayment>
            control={control}
            name="endDate"
            rules={{
              required: {
                value: watch("paymentPeriodCode") === TypePaymentPeriodCode["Custom"],
                message: "종료일을 입력해주세요",
              },
            }}
            type="date"
            placeholder={formPlaceholder?.endDate}
            disabled={watch("paymentPeriodCode") !== TypePaymentPeriodCode["Custom"]}
            prefixEl={<Icon name="Calendar" aria-hidden={true} />}
          />
        </FormHoc.Group>
      </FormHoc.Row>
      <FormHoc.Action>
        <Button type="reset" variants="secondary" onClick={onReset}>
          {formAction?.reset}
        </Button>
        <Button type="submit" variants="primary">
          {formAction?.submit}
        </Button>
      </FormHoc.Action>
    </SearchPaymentMainContainer>
  )
})

const SearchPaymentMainContainer = styled.form`
  /*  */
`

export default SearchPaymentMain
