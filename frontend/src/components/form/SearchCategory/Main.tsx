"use client"

import { FieldValues } from "react-hook-form"
import styled from "styled-components"
import FormHoc, { FormHocMainProps } from "@/components/entry/FormHoc"
import { TypeSearchCategory } from "@/components/form/SearchCategory"
import Label from "@/components/entry/Label"
import Select from "@/components/entry/Select"

export interface SearchCategoryMainProps<T extends FieldValues = TypeSearchCategory> extends FormHocMainProps<T> {
  //
}

const SearchCategoryMain = FormHoc<TypeSearchCategory>((props: SearchCategoryMainProps) => {
  const { formAction, formData, formPlaceholder, formOptionGroups, handleValid, children, ...restProps } = props

  const { control, handleSubmit, formState, getValues, setValue } = formData

  return (
    <SearchCategoryMainContainer
      id="search-category"
      onSubmit={handleSubmit(handleValid)}
      noValidate
      $isOpened={false}
      {...restProps}
    >
      <Label asTag="label" htmlFor="location" isRequired={true} className="sr-only">
        카테고리 선택
      </Label>
      <Select<TypeSearchCategory>
        control={control}
        name="categoryCode"
        rules={{}}
        multiple={false}
        shape="square"
        title={`${formPlaceholder?.categoryCode} 선택`}
        placeholder={formPlaceholder?.categoryCode ?? ""}
        optionGroups={formOptionGroups?.categoryCode ?? []}
        onSelected={([option]) => {
          if (!option) return
          if ((getValues("category") ?? "") === option.text) return
          setValue("category", option.text)
          handleSubmit(handleValid)()
        }}
      />
      {children}
    </SearchCategoryMainContainer>
  )
})

interface SearchCategoryMainStyled {
  $isOpened: boolean
}

const SearchCategoryMainContainer = styled.form<SearchCategoryMainStyled>`
  /*  */
`

export default SearchCategoryMain
