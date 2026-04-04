"use client"

import { Children, Fragment } from "react"
import styled from "styled-components"

export interface SearchLocationGroupProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLUListElement>> {
  //
}

const SearchLocationGroup = (props: SearchLocationGroupProps) => {
  const { className = "", children, ...restProps } = props

  return (
    <Fragment>
      <SearchLocationGroupContainer
        role="listbox"
        id="location-listbox"
        className={`${className}`}
        tabIndex={0}
        {...restProps}
      >
        {Children.map(children, (child) => (
          <li>{child}</li>
        ))}
      </SearchLocationGroupContainer>
    </Fragment>
  )
}

const SearchLocationGroupContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
`

export default SearchLocationGroup
