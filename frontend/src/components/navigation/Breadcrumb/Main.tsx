"use client"

import { Children } from "react"
import styled from "styled-components"

export interface BreadcrumbMainProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  //
}

const BreadcrumbMain = (props: BreadcrumbMainProps) => {
  const { className = "", children, ...restProps } = props

  if (!children) return null

  return (
    <BreadcrumbMainContainer className={`${className}`} {...restProps}>
      <ul>
        {Children.map(children, (child, index) => {
          const isLast = index === Children.count(children)
          return <li aria-current={isLast ? "page" : undefined}>{child}</li>
        })}
      </ul>
    </BreadcrumbMainContainer>
  )
}

const BreadcrumbMainContainer = styled.nav`
  ul {
    display: flex;
  }
  li {
    position: relative;
    &:not(:first-child) {
      padding-left: 22px;
    }
    &:not(:first-child):before {
      content: "";
      position: absolute;
      top: 50%;
      left: 6px;
      display: block;
      width: 7px;
      height: 7px;
      border-top: 1px solid rgb(var(--color-neutral600));
      border-left: 1px solid rgb(var(--color-neutral600));
      transform: translateY(-50%) rotate(135deg);
    }
  }
  a,
  span {
    display: block;
    max-width: 120px;
    font-size: ${(props) => props.theme.typo.size.sm};
    line-height: ${(props) => props.theme.typo.leading.sm};
    color: rgb(var(--color-neutral800));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export default BreadcrumbMain
