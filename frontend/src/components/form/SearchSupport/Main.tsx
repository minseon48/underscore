"use client"

import { FieldValues } from "react-hook-form"
import styled from "styled-components"
import FormHoc, { FormHocMainProps } from "@/components/entry/FormHoc"
import {
    TypeRecruitmentStatus,
    TypeSearchSupport,
    TypeSupportRegion,
    } from "@/components/form/SearchSupport/type"

import Icon from "@/components/general/Icon"
import Label from "@/components/entry/Label"
import Input from "@/components/entry/input"
import Button from "@/components/general/Button"
import Select from "@/components/entry/Select"

export interface SearchSupportMainProps<T extends FieldValues = TypeSearchSupport> extends FormHocMainProps<T>{

    }

const SearchSupportMain = FormHoc<TypeSearchSupport>((props: SearchSupportMainProps) => {
    const { formAction, formData, formPlaceholder, formOptionGroups, handleValid, ...restProps } = props
    const { control, handleSubmit, setValue } = formData

    const onReset = () => {
        setValue("page", 1)
        setValue("isFiltered", false)
        setValue("startDate", undefined)
        setValue("endDate", undefined)
        setValue("region", TypeSupportRegion.All)
        setValue("recruitmentStatus", TypeRecruitmentStatus.All)
        setValue("searchStartDate", undefined)
        setValue("searchEndDate", undefined)
        setValue("searchRegion", TypeSupportRegion.All)
        setValue("searchRecruitmentStatus", TypeRecruitmentStatus.All)
      }


    return (
        <SearchSupportMainContainer id="search-support" onSubmit={handleSubmit(handleValid)} noValidate {...restProps}>
          <FormHoc.Row>
            <FormHoc.Group>
              <Label asTag="label" htmlFor="startDate">
                접수 시작일
              </Label>
              <Input<TypeSearchSupport>
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

                      <Icon name = "Calendar" aria-hidden={true} />
                    </button>
                  }
              />
            </FormHoc.Group>
          <FormHoc.Group>
                    <Label asTag="label" htmlFor="endDate">
                      접수 종료일
                    </Label>
                    <Input<TypeSearchSupport>
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
                  <FormHoc.Group>
                    <Label asTag="label" htmlFor="region">
                      지역
                    </Label>
                    <Select<TypeSearchSupport>
                      control={control}
                      name="region"
                      rules={{}}
                      multiple={false}
                      shape="square"
                      title={`${formPlaceholder?.region ?? "지역"} 선택`}
                      placeholder={formPlaceholder?.region ?? ""}
                      optionGroups={formOptionGroups?.region ?? []}
                    />
                  </FormHoc.Group>
                  <FormHoc.Group>
                     <Label asTag="label" htmlFor="recruitmentStatus">
                        모집 진행여부
                     </Label>
                    <Select<TypeSearchSupport>
                      control={control}
                      name="recruitmentStatus"
                      rules={{}}
                      multiple={false}
                      shape="square"
                      title={`${formPlaceholder?.recruitmentStatus ?? "모집 진행여부"} 선택`}
                      placeholder={formPlaceholder?.recruitmentStatus ?? ""}
                      optionGroups={formOptionGroups?.recruitmentStatus ?? []}
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
    </SearchSupportMainContainer>
        )
    })

const SearchSupportMainContainer = styled.form``

export default SearchSupportMain