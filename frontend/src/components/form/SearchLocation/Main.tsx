"use client"

import { Children, useEffect, useMemo, useRef } from "react"
import { FieldValues } from "react-hook-form"
import styled, { css } from "styled-components"
import useFocusTrap from "@/libs/hook/useFocusTrap"
import FormHoc, { FormHocMainProps } from "@/components/entry/FormHoc"
import { TypeSearchLocation } from "@/components/form/SearchLocation"
import Icon from "@/components/general/Icon"
import Label from "@/components/entry/Label"
import Input from "@/components/entry/Input"

export interface SearchLocationMainProps<T extends FieldValues = TypeSearchLocation> extends FormHocMainProps<T> {
  //
}

const SearchLocationMain = FormHoc<TypeSearchLocation>((props: SearchLocationMainProps) => {
  const { formAction, formData, formPlaceholder, isUpdated, children, handleValid, ...restProps } = props

  const { control, handleSubmit, formState } = formData

  const containerRef = useRef<HTMLFormElement | null>(null)
  const hasChildren = useMemo(() => Children.toArray(children).filter(Boolean).length >= 2, [children])

  const {
    focusTrapRefs: { containerRef: trapRef },
    onActivate,
    onDeactivate,
  } = useFocusTrap([
    [
      "Escape",
      () => {
        if (!containerRef.current) return
        const comboboxEl = containerRef.current.querySelector("[role='combobox']") as HTMLElement
        comboboxEl?.focus?.()
      },
    ],
  ])

  const onOpen = () => {
    if (!containerRef.current) return
    const listboxEl = containerRef.current.querySelector("[role='listbox']") as HTMLElement
    onActivate()
    listboxEl?.focus?.()
  }

  const onClose = () => {
    if (!containerRef.current) return
    onDeactivate({ isReturnFocus: false })
  }

  useEffect(() => {
    if (isUpdated) trapRef.current?.firstElementChild?.scrollTo(0, 0)
  }, [isUpdated])

  useEffect(() => {
    if (hasChildren) onOpen()
    else onClose()
  }, [hasChildren])

  return (
    <SearchLocationMainContainer
      ref={containerRef}
      id="search-location"
      onSubmit={handleSubmit(handleValid)}
      noValidate
      $isOpened={hasChildren}
      {...restProps}
    >
      <Label asTag="label" htmlFor="location" isRequired={true} className="sr-only">
        검색
      </Label>
      <SearchLocationMainInput
        role="combobox"
        control={control}
        name="location"
        rules={{}}
        type="location"
        placeholder={formPlaceholder?.location}
        autoComplete="off"
        suffixEl={
          <button type="submit">
            <Icon name="Search" aria-hidden={true} />
            <span className="sr-only">{formAction?.submit}</span>
          </button>
        }
        aria-autocomplete={hasChildren ? "list" : "none"}
        aria-expanded={hasChildren}
      />
      <SearchLocationMainLayer ref={trapRef}>
        <div>{children}</div>
      </SearchLocationMainLayer>
    </SearchLocationMainContainer>
  )
})

interface SearchLocationMainStyled {
  $isOpened: boolean
}

const SearchLocationMainInput = styled(Input<TypeSearchLocation>)`
  border: none;
`

const SearchLocationMainLayer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  display: flex;
  width: 100%;
  background: rgb(var(--color-neutral100));
  border-radius: 6px;
  overflow: hidden;
  z-index: 1;
  box-shadow:
    0px 3px 6px -4px rgba(var(--color-neutral1300), 0.12),
    0px 6px 16px 0 rgba(var(--color-neutral1300), 0.08),
    0px 9px 28px 8px rgba(var(--color-neutral1300), 0.05);
  > div {
    width: 100%;
    max-height: 0;
    transition: max-height 200ms var(--motion-ease-out);
    overflow: auto;
  }
  #infiniteRef {
    margin-top: -4px;
    width: 100%;
    height: 4px;
  }
`

const SearchLocationMainContainer = styled.form<SearchLocationMainStyled>`
  position: relative;
  ${(props) =>
    props.$isOpened &&
    css`
      ${SearchLocationMainLayer} >div {
        max-height: 142px;
      }
    `}
`

export default SearchLocationMain
