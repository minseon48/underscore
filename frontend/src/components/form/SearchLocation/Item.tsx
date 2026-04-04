"use client"

import styled from "styled-components"
import { TypeSearchLocationResult } from "@/queries/api/map/useSearchLocationList"

export interface SearchLocationItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  data: TypeSearchLocationResult["documents"][number]
  onClick: () => void
}

const SearchLocationItem = (props: SearchLocationItemProps) => {
  const { data, className = "", onClick, ...restProps } = props

  return (
    <SearchLocationItemContainer
      role="option"
      type="button"
      className={`${className}`}
      onClick={onClick}
      {...restProps}
    >
      {data.address_name}
    </SearchLocationItemContainer>
  )
}

const SearchLocationItemContainer = styled.button`
  display: block;
  width: 100%;
  padding: 5px 8px;
  text-align: left;
  border-radius: 4px;
  &:hover,
  &:focus {
    background: rgb(var(--color-neutral300));
  }
`

export default SearchLocationItem
