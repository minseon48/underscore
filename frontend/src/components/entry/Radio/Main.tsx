"use client"

import { Fragment, useEffect, useMemo } from "react"
import { useController, Control, FieldValues, FieldPath, RegisterOptions } from "react-hook-form"
import styled, { css } from "styled-components"
import RadioItem from "@/components/entry/Radio/Item"

interface OptionGroups<T extends FieldValues = object> {
  label: string
  options: { value: T[FieldPath<T>]; text: string; description?: string }[]
}

export interface RadioMainProps<T extends FieldValues = object> extends React.HTMLAttributes<HTMLElement> {
  control: Control<T>
  name: FieldPath<T>
  rules?: RegisterOptions<T>
  disabled?: boolean
  optionGroups: OptionGroups<T>[]
  onBlur?: () => void
  onSelected?: (options: OptionGroups<T>["options"]) => void
}

const RadioMain = <T extends FieldValues = object>(props: RadioMainProps<T>) => {
  const {
    control,
    name,
    rules,
    disabled = false,
    optionGroups,
    className = "",
    onBlur,
    onSelected,
    ...restProps
  } = props

  const { field, fieldState } = useController({ control, name, rules })

  const currentGroups = useMemo(() => {
    return optionGroups
  }, [optionGroups])

  const currentOption = useMemo<OptionGroups<T>["options"]>(() => {
    return currentGroups?.flatMap(({ options }) => options)?.filter(({ value }) => value === field.value)
  }, [currentGroups, field.value])

  useEffect(() => {
    onSelected?.(currentOption)
  }, [currentOption])

  return (
    <RadioMainContainer className={`${className}`} $isDisabled={disabled} $isInvalid={Boolean(fieldState.error)}>
      {currentGroups.map(({ label, options }, index) => (
        <Fragment key={`${name}-${index}-label`}>
          {options.map(({ value, text, description = "" }) => (
            <RadioItem key={value} isChecked={field.value === value}>
              <input
                ref={field.ref}
                id={`${name}-${value}`}
                type="radio"
                value={value || ""}
                name={label}
                required={index === 0 ? Boolean(rules?.required) : undefined}
                disabled={disabled}
                onChange={(event) => {
                  if (event.target.value) {
                    field.onChange(event.target.value)
                  } else {
                    field.onChange("")
                  }
                }}
                onBlur={() => {
                  field.onBlur()
                  onBlur?.()
                }}
                {...restProps}
              />
              <label htmlFor={`${name}-${value}`}>
                <span>{text}</span>
                {description && <em>{description}</em>}
              </label>
            </RadioItem>
          ))}
        </Fragment>
      ))}
    </RadioMainContainer>
  )
}

interface RadioMainStyled {
  $isDisabled: boolean
  $isInvalid: boolean
}

const RadioMainContainer = styled.div<RadioMainStyled>`
  position: relative;
  display: flex;
  gap: 8px;
  transition-property: border-color, box-shadow;
  transition-duration: 0.2s;
  transition-timing-function: ease;
  transition-delay: 0s;
  /* color */
  /* & {
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
  } */
  /* ${(props) =>
    props.$isDisabled &&
    css`
      && {
        border-color: rgb(var(--color-neutral500));
        background-color: rgb(var(--color-neutral300));
      }
    `}; */
  /* ${(props) =>
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
    `} */
  /* ${(props) =>
    !props.$isDisabled &&
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
    `}; */
  /* child */
  /* input {
    position: relative;
    outline: none;
  } */
`

export default RadioMain
