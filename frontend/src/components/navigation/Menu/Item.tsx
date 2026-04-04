"use client"

import Link from "next/link"
import styled, { css } from "styled-components"
import { NonUndefined } from "@/libs/utils"
import Icon from "@/components/general/Icon"

export interface MenuItemProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLLIElement>> {
  depth: number
  isOpened: boolean
  isSelected: boolean
  onOpenChange: (origin: MenuItemProps["origin"]) => void
  onSelectChange: (origin: MenuItemProps["origin"]) => void
  origin: {
    key: string
    label: string
    href?: string
    onClick?: () => void
    items?: MenuItemProps["origin"][]
  }
}

const MenuItem = (props: MenuItemProps) => {
  const {
    depth,
    isOpened,
    isSelected,
    origin,
    className = "",
    children,
    onOpenChange,
    onSelectChange,
    ...restProps
  } = props

  if (children) {
    return (
      <MenuItemContainer
        className={`${className}`}
        aria-expanded={isOpened}
        $depth={depth}
        $isOpened={isOpened}
        $isSelected={isSelected}
        $hasChildren={true}
        {...restProps}
      >
        <button type="button" className="label" onClick={() => onOpenChange(origin)}>
          {origin.label}
          <span className="sr-only">{isSelected ? "(선택됨)" : ""}</span>
          <span className="sr-only">{isOpened ? "닫기" : "열기"}</span>
          <Icon name="CaretDown" aria-hidden={true} />
        </button>
        {children}
      </MenuItemContainer>
    )
  }

  return (
    <MenuItemContainer
      className={`${className}`}
      $depth={depth}
      $isOpened={isOpened}
      $isSelected={isSelected}
      $hasChildren={false}
      {...restProps}
    >
      {origin?.href ? (
        <Link href={origin?.href} className="label" onClick={() => onSelectChange(origin)}>
          {origin.label}
        </Link>
      ) : origin?.onClick ? (
        <button
          type="button"
          className="label"
          onClick={() => {
            onSelectChange(origin)
            origin?.onClick?.()
          }}
        >
          {origin.label}
        </button>
      ) : (
        <span className="label" onClick={() => onSelectChange(origin)}>
          {origin.label}
        </span>
      )}
    </MenuItemContainer>
  )
}

interface MenuItemStyled {
  $depth: NonUndefined<MenuItemProps["depth"]>
  $isOpened: NonUndefined<MenuItemProps["isOpened"]>
  $isSelected: NonUndefined<MenuItemProps["isSelected"]>
  $hasChildren: boolean
}

const MenuItemContainer = styled.li<MenuItemStyled>`
  > .label {
    position: relative;
    display: block;
    width: 100%;
    padding-left: ${(props) => `${(props.$depth + 1) * 16}px`};
    padding-right: ${(props) => (props.$hasChildren ? "34px" : "16px")};
    text-align: left;
    line-height: 40px;
    border: 1px solid transparent;
    border-radius: 8px;
    transition-property: color, background-color;
    transition-duration: 0.2s;
    transition-timing-function: ease;
    transition-delay: 0s;
    &:hover {
      background-color: rgba(var(--color-neutral1300), 0.06);
    }
    &:focus-visible {
      outline: none;
      border-color: rgb(var(--color-primary300));
    }
    svg {
      position: absolute;
      top: 50%;
      right: 16px;
      font-size: 10px;
      transform: translateY(-50%);
    }
  }
  ${(props) => {
    if (props.$isOpened) {
      return css`
        > .label {
          svg {
            transform: translateY(-50%) rotate(180deg);
          }
        }
      `
    }
  }}
  ${(props) => {
    if (props.$isSelected) {
      return css`
        > .label {
          color: rgb(var(--color-primary600));
          background-color: ${!props.$hasChildren ? "rgb(var(--color-primary100))" : ""};
        }
      `
    }
  }}
`

export default MenuItem
