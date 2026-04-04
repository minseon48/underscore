"use client"

import styled from "styled-components"
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form"
import { SelectMainProps } from "@/components/entry/Select"
import { RadioMainProps } from "@/components/entry/Radio"

export interface FormHocMainProps<T extends FieldValues = object>
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLFormElement>> {
  formData: UseFormReturn<T>
  formAction?: { [key in "reset" | "submit" | "cancel"]?: string }
  formPlaceholder?: { [key in keyof T]?: string }
  formOptionGroups?: { [key in keyof T]?: SelectMainProps<T>["optionGroups"] | RadioMainProps<T>["optionGroups"] }
  isLoading?: boolean
  isSuccess?: boolean
  isUpdated?: boolean
  handleValid: SubmitHandler<T>
  handleCanceled?: () => void
}

const FormHocMain = <T extends FieldValues = object>(FormHocMain: (props: FormHocMainProps<T>) => React.ReactNode) => {
  return function Form(props: FormHocMainProps<T>) {
    const { className = "", ...restProps } = props
    return (
      <FormHocMainContainer className={`${className}`}>
        <FormHocMain {...restProps} />
      </FormHocMainContainer>
    )
  }
}

const FormHocMainContainer = styled.div`
  //
`

export default FormHocMain
