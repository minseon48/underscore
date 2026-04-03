"use client"

import styled from "styled-components"

export interface SelectItemProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>> {
  //
}

const SelectItem = (props: SelectItemProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <SelectItemContainer type="button" className={`${className}`} {...restProps}>
      {children}
    </SelectItemContainer>
  )
}

const SelectItemContainer = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 5px 8px;
  text-align: left;
  border-radius: 4px;
  &:hover,
  &:focus {
    background: rgb(var(--color-neutral300));
  }
  &[aria-selected="true"] {
    font-weight: 500;
    background: rgb(var(--color-primary100));
  }
`

export default SelectItem
