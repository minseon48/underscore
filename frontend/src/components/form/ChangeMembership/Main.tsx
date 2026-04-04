"use client"

import { FieldValues } from "react-hook-form"
import styled from "styled-components"
import FormHoc, { FormHocMainProps } from "@/components/entry/FormHoc"
import { TypeChangeMembership } from "@/components/form/ChangeMembership"
import Label from "@/components/entry/Label"
import Helper from "@/components/entry/Helper"
import Radio from "@/components/entry/Radio"

export interface ChangeMembershipMainProps<T extends FieldValues = TypeChangeMembership> extends FormHocMainProps<T> {
  //
}

const ChangeMembershipMain = FormHoc<TypeChangeMembership>((props: ChangeMembershipMainProps) => {
  const { formAction, formData, formPlaceholder, formOptionGroups, isLoading, handleValid, ...restProps } = props

  const { control, handleSubmit, formState, getValues, setValue } = formData

  return (
    <ChangeMembershipMainContainer
      id="change-membership"
      onSubmit={handleSubmit(handleValid)}
      noValidate
      {...restProps}
    >
      <FormHoc.Row>
        <FormHoc.Group>
          <Label asTag="span" isRequired={true} className="sr-only">
            {formPlaceholder?.subscriptionCode}
          </Label>
          <ChangeMembershipMainRadio
            control={control}
            name="subscriptionCode"
            rules={{
              required: {
                value: true,
                message: "이용권 종류를 선택해주세요",
              },
            }}
            optionGroups={formOptionGroups?.subscriptionCode ?? []}
            onSelected={([option]) => {
              if (!option) return
              if ((getValues("subscription") ?? "") === option.text) return
              setValue("subscription", option.text)
            }}
          />
          <Helper variants="error">{formState?.errors?.subscriptionCode?.message}</Helper>
        </FormHoc.Group>
      </FormHoc.Row>
    </ChangeMembershipMainContainer>
  )
})

const ChangeMembershipMainRadio = styled(Radio<TypeChangeMembership>)`
  > div {
    flex: 1 1 0px;
    padding: 10px 12px;
    border: 1px solid rgb(var(--color-neutral500));
    border-radius: 8px;
  }
  label {
    gap: 4px;
    &:before,
    &:after {
      top: 5px;
    }
    span {
      font-size: ${(props) => props.theme.typo.size.base};
      line-height: ${(props) => props.theme.typo.leading.base};
    }
  }
  @media ${(props) => props.theme.screen.device.md} {
    flex-direction: column;
  }
`

const ChangeMembershipMainContainer = styled.form`
  /*  */
`

export default ChangeMembershipMain
