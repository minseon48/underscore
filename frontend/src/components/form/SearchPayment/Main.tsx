"use client"

import { FieldValues } from "react-hook-form"
import styled from "styled-components"
import FormHoc, { FormHocMainProps } from "@/components/entry/FormHoc"
import { TypePaymentStateCode, TypeSearchPayment } from "@/components/form/SearchPayment/type"
import Icon from "@/components/general/Icon"
import Label from "@/components/entry/Label"
import Input from "@/components/entry/input"
import Button from "@/components/general/Button"
import Select from "@/components/entry/Select"

export interface SearchPaymentMainProps<T extends FieldValues = TypeSearchPayment> extends FormHocMainProps<T> {
  //
}

const SearchPaymentMain = FormHoc<TypeSearchPayment>((props: SearchPaymentMainProps) => {
  const { formAction, formData, formPlaceholder, formOptionGroups, children, handleValid, ...restProps } = props

  const { control, handleSubmit, setValue } = formData

  const onReset = () => {
    setValue("page", 1)
    setValue("isFiltered", false)
    setValue("paymentStateCode", TypePaymentStateCode["All"])
    setValue("startDate", undefined)
    setValue("endDate", undefined)
    setValue("searchPaymentStateCode",TypePaymentStateCode["All"])
    setValue("searchStartDate",undefined)
    setValue("searchStartDate",undefined)
    setValue("searchStartDate",undefined)
    setValue("searchEndDate",undefined)
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
          <Label asTag="label" htmlFor="startDate">
            시작일
          </Label>
          <Input<TypeSearchPayment>
            control={control}
            name="startDate"
            rules={{}}
            type="date"
            placeholder={formPlaceholder?.startDate}
            prefixEl={
              <button
                type="button"
                onClick={(event) => {
                  const input = event.currentTarget.closest("div")?.querySelector("input")
                  input?.showPicker?.()
                }}
              >
                <Icon name="Calendar" aria-hidden={true} />
              </button>
            }
          />
        </FormHoc.Group>
        <FormHoc.Group>
          <Label asTag="label" htmlFor="endDate">
            종료일
          </Label>
          <Input<TypeSearchPayment>
            control={control}
            name="endDate"
            rules={{}}
            type="date"
            placeholder={formPlaceholder?.endDate}
            prefixEl={
              <button
                type="button"
                onClick={(event) => {
                  const input = event.currentTarget.closest("div")?.querySelector("input")
                  input?.showPicker?.()
                }}
              >
                <Icon name="Calendar" aria-hidden={true} />
              </button>
            }
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
