"use client"

import { FieldValues } from "react-hook-form"
import styled from "styled-components"
import FormHoc, { FormHocMainProps } from "@/components/entry/FormHoc"
import { TypeSearchBusiness } from "@/components/form/SearchBusiness"
import Label from "@/components/entry/Label"
import Select from "@/components/entry/Select"

export interface SearchBusinessMainProps<T extends FieldValues = TypeSearchBusiness> extends FormHocMainProps<T> {
  //
}

const SearchBusinessMain = FormHoc<TypeSearchBusiness>((props: SearchBusinessMainProps) => {
  const { formAction, formData, formPlaceholder, formOptionGroups, handleValid, children, ...restProps } = props

  const { control, handleSubmit, formState, getValues, setValue } = formData

  return (
    <SearchBusinessMainContainer
      id="search-business"
      onSubmit={handleSubmit(handleValid)}
      noValidate
      $isOpened={false}
      {...restProps}
    >
      <Label asTag="label" htmlFor="location" isRequired={true} className="sr-only">
        업종 선택
      </Label>
      <Select<TypeSearchBusiness>
        control={control}
        name="businessCode"
        rules={{}}
        multiple={false}
        shape="square"
        title={`${formPlaceholder?.businessCode} 선택`}
        placeholder={formPlaceholder?.businessCode ?? ""}
        optionGroups={formOptionGroups?.businessCode ?? []}
        onSelected={([option]) => {
          if (!option) return
          if ((getValues("business") ?? "") === option.text) return
          setValue("business", option.text)
          handleSubmit(handleValid)()
        }}
      />
      {children}
    </SearchBusinessMainContainer>
  )
})

interface SearchBusinessMainStyled {
  $isOpened: boolean
}

const SearchBusinessMainContainer = styled.form<SearchBusinessMainStyled>`
  /*  */
`

export default SearchBusinessMain
