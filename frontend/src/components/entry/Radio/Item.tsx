"use client"

import styled, { css } from "styled-components"

export interface RadioItemProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  isChecked: boolean
}

const RadioItem = (props: RadioItemProps) => {
  const { isChecked, className = "", children, ...restProps } = props

  return (
    <RadioItemContainer className={`${className}`} $isChecked={isChecked} {...restProps}>
      {children}
    </RadioItemContainer>
  )
}

interface RadioItemStyled {
  $isChecked: RadioItemProps["isChecked"]
}

const RadioItemContainer = styled.div<RadioItemStyled>`
  position: relative;
  input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    outline: inherit;
  }
  label {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0 8px 0 24px;
    span {
      color: rgb(var(--color-neutral1100));
    }
    em {
      color: rgb(var(--color-neutral700));
    }
    &:before {
      content: "";
      position: absolute;
      top: 3px;
      left: 0;
      display: block;
      width: 16px;
      height: 16px;
      background: rgb(var(--color-neutral100));
      border: 1px solid rgb(var(--color-neutral500));
      border-radius: 50%;
      transition-property: border-color, background-color;
      transition-duration: 200ms;
      transition-timing-function: ease;
      transition-delay: 0s;
      ${(props) =>
        props.$isChecked &&
        css`
          & {
            border-color: rgb(var(--color-primary600));
            background-color: rgb(var(--color-primary600));
          }
        `}
    }
    &:after {
      content: "";
      position: absolute;
      top: 3px;
      left: 0;
      display: block;
      width: 16px;
      height: 16px;
      background: rgb(var(--color-neutral100));
      border-radius: 50%;
      opacity: 0;
      transform: scale(0);
      transition-property: opacity, transform;
      transition-duration: 300ms;
      transition-timing-function: var(--motion-ease-in-out-circ);
      transition-delay: 0s;
      ${(props) =>
        props.$isChecked &&
        css`
          & {
            opacity: 1;
            transform: scale(0.375);
          }
        `}
    }
  }
`

export default RadioItem
