"use client"

import styled, { css } from "styled-components"
import { useController, Control, FieldValues, FieldPath, RegisterOptions } from "react-hook-form"
import { NonUndefined } from "@/libs/utils"
import { InputSize } from "@/components/entry/Input/type"

export interface InputMainProps<T extends FieldValues = object> extends React.HTMLAttributes<HTMLInputElement> {
  control: Control<T>
  name: FieldPath<T>
  rules?: RegisterOptions<T>
  type?: string
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  autoComplete?: "on" | "off"
  max?: string | number
  min?: string | number
  size?: InputSize
  prefixEl?: React.ReactNode
  suffixEl?: React.ReactNode
  onBlur?: () => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const InputMain = <T extends FieldValues = object>(props: InputMainProps<T>) => {
  const {
    control,
    name,
    rules,
    type = "text",
    disabled = false,
    readOnly = false,
    placeholder = "",
    autoComplete = "off",
    min,
    max,
    size = InputSize.BASE,
    prefixEl = null,
    suffixEl = null,
    className = "",
    onBlur,
    onChange,
    ...restProps
  } = props

  const { field, fieldState } = useController({ control, name, rules })

  return (
    <InputMainContainer
      className={`${className}`}
      $size={size}
      $isDisabled={disabled}
      $isReadOnly={readOnly}
      $isInvalid={Boolean(fieldState.error)}
    >
      {prefixEl && <span className="extra-prefix">{prefixEl}</span>}
      <input
        ref={field.ref}
        id={name}
        type={type}
        value={field.value || ""}
        required={Boolean(rules?.required)}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        max={max}
        onChange={(event) => {
          if (event.target.value) {
            field.onChange(
              type === "number"
                ? +event.target.value
                : type === "tel"
                  ? event.target.value.match(/\\d+/g)?.join("")
                  : event.target.value,
            )
          } else {
            field.onChange("")
          }
          onChange?.(event)
        }}
        onBlur={() => {
          field.onBlur()
          onBlur?.()
        }}
        {...restProps}
      />
      {suffixEl && <span className="extra-suffix">{suffixEl}</span>}
    </InputMainContainer>
  )
}

interface InputMainStyled<T extends FieldValues = object> {
  $size: NonUndefined<InputMainProps<T>["size"]>
  $isDisabled: boolean
  $isReadOnly: boolean
  $isInvalid: boolean
}

const InputMainContainer = styled.div<InputMainStyled>`
  position: relative;
  display: flex;
  gap: 8px;
  transition-property: border-color, box-shadow;
  transition-duration: 0.2s;
  transition-timing-function: ease;
  transition-delay: 0s;
  /* size */
  ${(props) => {
    switch (props.$size) {
      case InputSize.SM:
        return css`
          height: 24px;
          border-radius: 4px;
          > :first-child {
            padding-left: 8px;
          }
          > :last-child {
            padding-right: 8px;
          }
        `
      case InputSize.LG:
        return css`
          height: 40px;
          border-radius: 8px;
          > :first-child {
            padding-left: 12px;
          }
          > :last-child {
            padding-right: 12px;
          }
        `
      case InputSize.BASE:
      default:
        return css`
          height: 32px;
          border-radius: 6px;
          > :first-child {
            padding-left: 12px;
          }
          > :last-child {
            padding-right: 12px;
          }
        `
    }
  }}
  /* color */
  & {
    border: 1px solid rgb(var(--color-neutral500));
    background-color: rgb(var(--color-neutral100));
  }
  &:hover {
    border-color: rgb(var(--color-primary600));
    background-color: rgb(var(--color-neutral100));
  }
  &:focus-within,
  &:focus-visible {
    border-color: rgb(var(--color-primary600));
    box-shadow: 0 0 0 2px rgba(var(--color-primary500), 0.1);
  }
  ${(props) =>
    props.$isDisabled &&
    css`
      && {
        border-color: rgb(var(--color-neutral500));
        background-color: rgb(var(--color-neutral300));
      }
    `};
  ${(props) =>
    Boolean(!props.$isDisabled && props.$isInvalid) &&
    css`
      && {
        border-color: rgb(var(--color-red600));
      }
      &&:hover {
        border-color: rgb(var(--color-red600));
      }
      &&:focus-within,
      &&:focus-visible {
        border-color: rgb(var(--color-red600));
        box-shadow: 0 0 0 2px rgba(var(--color-red500), 0.1);
      }
    `}
  ${(props) =>
    Boolean(!props.$isDisabled && props.$isReadOnly) &&
    css`
      && {
        border-color: rgb(var(--color-neutral500));
        background-color: rgb(var(--color-neutral300));
      }
      &&:hover {
        border-color: rgb(var(--color-neutral600));
        background-color: rgb(var(--color-neutral300));
      }
      &&:focus-within,
      &&:focus-visible {
        border-color: rgb(var(--color-neutral600));
        box-shadow: 0 0 0 2px rgba(var(--color-neutral500), 0.1);
      }
    `};
  /* child */
  input {
    position: relative;
    outline: none;
  }
  .extra-prefix,
  .extra-suffix {
    display: flex;
    flex: none;
    align-items: center;
    font-size: ${(props) => props.theme.typo.size.sm};
    line-height: ${(props) => props.theme.typo.leading.sm};
    > button {
      margin: -4px;
      padding: 4px;
    }
  }
`

export default InputMain
