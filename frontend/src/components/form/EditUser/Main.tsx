"use client"

import { FieldValues } from "react-hook-form"
import styled from "styled-components"
import FormHoc, { FormHocMainProps } from "@/components/entry/FormHoc"
import { TypeEditUser } from "@/components/form/EditUser"
import Icon from "@/components/general/Icon"
import Label from "@/components/entry/Label"
import Input from "@/components/entry/Input"
import Helper from "@/components/entry/Helper"

export interface EditUserMainProps<T extends FieldValues = TypeEditUser> extends FormHocMainProps<T> {
  //
}

const EditUserMain = FormHoc<TypeEditUser>((props: EditUserMainProps) => {
  const { formAction, formData, formPlaceholder, isLoading, handleValid, ...restProps } = props

  const { control, handleSubmit, formState } = formData

  return (
    <EditUserMainContainer id="edit-user" onSubmit={handleSubmit(handleValid)} noValidate {...restProps}>
      <FormHoc.Row>
        <FormHoc.Group>
          <Label asTag="label" htmlFor="email" isRequired={true}>
            이메일
          </Label>
          <Input<TypeEditUser>
            control={control}
            name="email"
            rules={{
              required: {
                value: true,
                message: "이메일을 입력해주세요",
              },
              pattern: {
                value: /^[\w-.]+@([\w-.])+[\w-]{2,}$/,
                message: "이메일 형식을 확인해주세요",
              },
            }}
            type="email"
            placeholder={formPlaceholder?.email}
            prefixEl={<Icon name="Mail" aria-hidden={true} />}
          />
          <Helper variants="error">{formState?.errors?.email?.message}</Helper>
        </FormHoc.Group>
      </FormHoc.Row>

      <FormHoc.Row>
        <FormHoc.Group>
          <Label asTag="label" htmlFor="name" isRequired={true}>
            이름
          </Label>
          <Input<TypeEditUser>
            control={control}
            name="name"
            rules={{
              required: {
                value: true,
                message: "이름을 입력해주세요",
              },
            }}
            type="text"
            placeholder={formPlaceholder?.name}
            prefixEl={<Icon name="User" aria-hidden={true} />}
          />
          <Helper variants="error">{formState?.errors?.name?.message}</Helper>
        </FormHoc.Group>
      </FormHoc.Row>
    </EditUserMainContainer>
  )
})

const EditUserMainContainer = styled.form`
  /*  */
`

export default EditUserMain
