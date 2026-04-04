"use client"

import { forwardRef } from "react"
import styled, { css } from "styled-components"
import { NonUndefined } from "@/libs/utils"
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "@/types/polymorphic"
import { ButtonShape, ButtonSize, ButtonVariants } from "@/components/general/Button/type"

export type ButtonMainProps<C extends React.ElementType = "button"> = PolymorphicComponentPropWithRef<
  C,
  {
    shape?: ButtonShape
    size?: ButtonSize
    variants?: ButtonVariants
    isDanger?: boolean
    isActive?: boolean
    prefixEl?: React.ReactNode
    suffixEl?: React.ReactNode
  }
>

export type ButtonMainComponent = <C extends React.ElementType = "button">(props: ButtonMainProps<C>) => React.ReactNode

const ButtonMain: ButtonMainComponent = forwardRef(function ButtonMain<C extends React.ElementType = "button">(
  props: ButtonMainProps<C>,
  ref?: PolymorphicRef<C>,
): React.ReactNode {
  const {
    asTag,
    shape = ButtonShape.Square,
    size = ButtonSize.BASE,
    variants = ButtonVariants.Primary,
    isDanger = false,
    isActive = false,
    prefixEl = null,
    suffixEl = null,
    className = "",
    children,
    ...restProps
  } = props

  return (
    <ButtonMainContainer
      ref={ref}
      as={asTag ?? "button"}
      $shape={shape}
      $size={size}
      $variants={variants}
      $isDanger={isDanger}
      $isActive={isActive}
      className={`${className}`}
      {...restProps}
    >
      {prefixEl && <span className="extra-prefix">{prefixEl}</span>}
      {children}
      {suffixEl && <span className="extra-suffix">{suffixEl}</span>}
    </ButtonMainContainer>
  )
})

interface ButtonMainStyled<C extends React.ElementType = "button"> {
  $shape: NonUndefined<ButtonMainProps<C>["shape"]>
  $size: NonUndefined<ButtonMainProps<C>["size"]>
  $variants: NonUndefined<ButtonMainProps<C>["variants"]>
  $isDanger: NonUndefined<ButtonMainProps<C>["isDanger"]>
  $isActive: NonUndefined<ButtonMainProps<C>["isActive"]>
}

const ButtonSquare = css<ButtonMainStyled>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 400;
  text-align: center;
  color: rgb(var(--color-neutral1100));
  border: 1px solid transparent;
  outline: none;
  /* size */
  ${(props) => {
    switch (props.$size) {
      case ButtonSize.SM:
        return css`
          padding: 0 7px;
          font-size: ${(props) => props.theme.typo.size.sm};
          line-height: ${(props) => props.theme.typo.leading.sm};
          border-radius: 4px;
        `
      case ButtonSize.LG:
        return css`
          padding: 7px 15px;
          font-size: ${(props) => props.theme.typo.size.base};
          line-height: ${(props) => props.theme.typo.leading.base};
          border-radius: 8px;
        `
      case ButtonSize.BASE:
      default:
        return css`
          padding: 4px 15px;
          font-size: ${(props) => props.theme.typo.size.sm};
          line-height: ${(props) => props.theme.typo.leading.sm};
          border-radius: 6px;
        `
    }
  }}
`

const ButtonSquarePrimary = css<ButtonMainStyled>`
  &&:disabled {
    color: rgb(var(--color-neutral800));
    background: rgb(var(--color-neutral300));
    border-color: rgb(var(--color-neutral500));
  }
  ${(props) => {
    switch (props.$isDanger) {
      case true:
        return css`
          color: rgb(var(--color-neutral100));
          background: rgb(var(--color-red500));
          border-color: rgb(var(--color-red500));
          &:not(:disabled):hover {
            color: rgb(var(--color-neutral100));
            background: rgb(var(--color-red400));
            border-color: rgb(var(--color-red400));
          }
          &:not(:disabled):focus-visible {
            outline: 4px solid rgb(var(--color-red300));
            outline-offset: 1px;
          }
          &:not(:disabled):active {
            color: rgb(var(--color-neutral100));
            background: rgb(var(--color-red600));
            border-color: rgb(var(--color-red600));
          }
          ${props.$isActive &&
          css`
            &:not(:disabled) {
              color: rgb(var(--color-neutral100));
              background: rgb(var(--color-red600));
              border-color: rgb(var(--color-red600));
            }
          `}
        `
      case false:
      default:
        return css`
          color: rgb(var(--color-neutral100));
          background: rgb(var(--color-primary600));
          border-color: rgb(var(--color-primary600));
          &:not(:disabled):hover {
            color: rgb(var(--color-neutral100));
            background: rgb(var(--color-primary500));
            border-color: rgb(var(--color-primary500));
          }
          &:not(:disabled):focus-visible {
            outline: 4px solid rgb(var(--color-primary300));
            outline-offset: 1px;
          }
          &:not(:disabled):active {
            color: rgb(var(--color-neutral100));
            background: rgb(var(--color-primary700));
            border-color: rgb(var(--color-primary700));
          }
          ${props.$isActive &&
          css`
            &:not(:disabled) {
              color: rgb(var(--color-neutral100));
              background: rgb(var(--color-primary700));
              border-color: rgb(var(--color-primary700));
            }
          `}
        `
    }
  }}
`

const ButtonSquareSecondary = css<ButtonMainStyled>`
  &&:disabled {
    color: rgb(var(--color-neutral800));
    background: rgb(var(--color-neutral300));
    border-color: rgb(var(--color-neutral500));
  }
  ${(props) => {
    switch (props.$isDanger) {
      case true:
        return css`
          color: rgb(var(--color-red500));
          background: rgb(var(--color-neutral100));
          border-color: rgb(var(--color-red500));
          &:not(:disabled):hover {
            color: rgb(var(--color-red400));
            background: rgb(var(--color-neutral100));
            border-color: rgb(var(--color-red400));
          }
          &:not(:disabled):focus-visible {
            outline: 4px solid rgb(var(--color-red300));
            outline-offset: 1px;
          }
          &:not(:disabled):active {
            color: rgb(var(--color-red600));
            background: rgb(var(--color-neutral100));
            border-color: rgb(var(--color-red600));
          }
          ${props.$isActive &&
          css`
            &:not(:disabled) {
              color: rgb(var(--color-red600));
              background: rgb(var(--color-neutral100));
              border-color: rgb(var(--color-red600));
            }
          `}
        `
      case false:
      default:
        return css`
          color: rgb(var(--color-neutral1100));
          background: rgb(var(--color-neutral100));
          border-color: rgb(var(--color-neutral500));
          &:not(:disabled):hover {
            color: rgb(var(--color-primary500));
            background: rgb(var(--color-neutral100));
            border-color: rgb(var(--color-primary500));
          }
          &:not(:disabled):focus-visible {
            outline: 4px solid rgb(var(--color-primary300));
            outline-offset: 1px;
          }
          &:not(:disabled):active {
            color: rgb(var(--color-primary700));
            background: rgb(var(--color-neutral100));
            border-color: rgb(var(--color-primary700));
          }
          ${props.$isActive &&
          css`
            &:not(:disabled) {
              color: rgb(var(--color-primary700));
              background: rgb(var(--color-neutral100));
              border-color: rgb(var(--color-primary700));
            }
          `}
        `
    }
  }}
`

const ButtonPlain = css<ButtonMainStyled>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 400;
  color: rgb(var(--color-neutral1100));
  /* size */
  ${(props) => {
    switch (props.$size) {
      case ButtonSize.SM:
        return css`
          font-size: ${(props) => props.theme.typo.size.sm};
          line-height: ${(props) => props.theme.typo.leading.sm};
        `
      case ButtonSize.LG:
        return css`
          font-size: ${(props) => props.theme.typo.size.base};
          line-height: ${(props) => props.theme.typo.leading.base};
        `
      case ButtonSize.BASE:
      default:
        return css`
          font-size: ${(props) => props.theme.typo.size.sm};
          line-height: ${(props) => props.theme.typo.leading.sm};
        `
    }
  }}
`

const ButtonPlainPrimary = css<ButtonMainStyled>`
  &&:disabled {
    color: rgb(var(--color-neutral800));
  }
  ${(props) => {
    switch (props.$isDanger) {
      case true:
        return css`
          color: rgb(var(--color-red500));
          &:not(:disabled):hover {
            color: rgb(var(--color-red400));
          }
          &:not(:disabled):active {
            color: rgb(var(--color-red600));
          }
          ${props.$isActive &&
          css`
            &:not(:disabled) {
              color: rgb(var(--color-red600));
            }
          `}
        `
      case false:
      default:
        return css`
          color: rgb(var(--color-primary600));
          &:not(:disabled):hover {
            color: rgb(var(--color-primary500));
          }
          &:not(:disabled):active {
            color: rgb(var(--color-primary700));
          }
          ${props.$isActive &&
          css`
            &:not(:disabled) {
              color: rgb(var(--color-primary700));
            }
          `}
        `
    }
  }}
`

const ButtonPlainSecondary = css<ButtonMainStyled>`
  &&:disabled {
    color: rgb(var(--color-neutral800));
  }
  ${(props) => {
    switch (props.$isDanger) {
      case true:
        return css`
          color: rgb(var(--color-red500));
          &:not(:disabled):hover {
            color: rgb(var(--color-red400));
          }
          &:not(:disabled):active {
            color: rgb(var(--color-red600));
          }
          ${props.$isActive &&
          css`
            &:not(:disabled) {
              color: rgb(var(--color-red600));
            }
          `}
        `
      case false:
      default:
        return css`
          color: rgb(var(--color-neutral1100));
          &:not(:disabled):hover {
            color: rgb(var(--color-neutral1000));
          }
          &:not(:disabled):active {
            color: rgb(var(--color-neutral1200));
          }
          ${props.$isActive &&
          css`
            &:not(:disabled) {
              color: rgb(var(--color-neutral1200));
            }
          `}
        `
    }
  }}
`

const ButtonMainContainer = styled.button<ButtonMainStyled>`
  transition-property: border-color, background-color;
  transition-duration: 0.2s;
  transition-timing-function: var(--motion-ease-in-out);
  transition-delay: 0s;
  ${(props) => {
    switch (props.$shape) {
      case ButtonShape.Plain:
        switch (props.$variants) {
          case ButtonVariants.Secondary:
            return [ButtonPlain, ButtonPlainSecondary]
          case ButtonVariants.Primary:
          default:
            return [ButtonPlain, ButtonPlainPrimary]
        }
      case ButtonShape.Square:
      default:
        switch (props.$variants) {
          case ButtonVariants.Secondary:
            return [ButtonSquare, ButtonSquareSecondary]
          case ButtonVariants.Primary:
          default:
            return [ButtonSquare, ButtonSquarePrimary]
        }
    }
  }}
  &:disabled {
    opacity: 0.8;
  }
  .extra-prefix,
  .extra-suffix {
    display: flex;
    flex: none;
    align-items: center;
    > button {
      margin: -4px;
      padding: 4px;
    }
    ${(props) => {
      switch (props.$size) {
        case ButtonSize.SM:
          return css`
            font-size: ${(props) => props.theme.typo.size.xs};
          `
        case ButtonSize.LG:
          return css`
            font-size: ${(props) => props.theme.typo.size.sm};
          `
        case ButtonSize.BASE:
        default:
          return css`
            font-size: ${(props) => props.theme.typo.size.xs};
          `
      }
    }}
  }
`

export default ButtonMain
