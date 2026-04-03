"use client"

import { forwardRef } from "react"
import styled, { css } from "styled-components"
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "@/types/polymorphic"
import { AlertStatusCode } from "@/components/feedback/Alert/type"
import Icon from "@/components/general/Icon"

export type AlertMainProps<C extends React.ElementType = "div"> = PolymorphicComponentPropWithRef<
  C,
  {
    statusCode: AlertStatusCode
    statusMessage: string
    hasIcon: boolean
  }
>

export type AlertMainComponent = <C extends React.ElementType = "div">(props: AlertMainProps<C>) => React.ReactNode

const AlertMain: AlertMainComponent = forwardRef(function AlertMain<C extends React.ElementType = "div">(
  props: AlertMainProps<C>,
  ref?: PolymorphicRef<C>,
): React.ReactNode {
  const { asTag, statusCode, statusMessage, hasIcon, className = "", children, ...restProps } = props

  return (
    <AlertMainContainer
      ref={ref}
      as={asTag ?? "div"}
      className={`${className}`}
      $statusCode={statusCode}
      {...restProps}
    >
      {hasIcon && (
        <AlertMainStatus>
          {statusCode === AlertStatusCode.Success && <Icon name="CheckCircleFilled" aria-hidden={true} />}
          {statusCode === AlertStatusCode.Info && <Icon name="InfoCircleFilled" aria-hidden={true} />}
          {statusCode === AlertStatusCode.Warning && <Icon name="ExclamationCircleFilled" aria-hidden={true} />}
          {statusCode === AlertStatusCode.Error && <Icon name="CloseCircleFilled" aria-hidden={true} />}
          <span className="sr-only">{statusMessage}</span>
        </AlertMainStatus>
      )}
      <AlertMainContent>{children}</AlertMainContent>
    </AlertMainContainer>
  )
})

interface AlertStyled<C extends React.ElementType = "div"> {
  $statusCode: AlertMainProps<C>["statusCode"]
}

const AlertMainContent = styled.strong`
  /*  */
`

const AlertMainStatus = styled.div`
  flex: none;
  padding: 4px 0;
`

const AlertMainContainer = styled.div<AlertStyled>`
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  font-size: ${(props) => props.theme.typo.size.sm};
  line-height: ${(props) => props.theme.typo.leading.sm};
  border: 1px solid transparent;
  border-radius: 8px;
  ${(props) => {
    switch (props.$statusCode) {
      case AlertStatusCode.Info:
        return css`
          background: rgb(var(--color-primary100));
          border-color: rgb(var(--color-primary300));
          ${AlertMainStatus} {
            color: rgb(var(--color-primary600));
          }
        `
      case AlertStatusCode.Warning:
        return css`
          background: rgb(var(--color-gold100));
          border-color: rgb(var(--color-gold300));
          ${AlertMainStatus} {
            color: rgb(var(--color-gold600));
          }
        `
      case AlertStatusCode.Error:
        return css`
          background: rgb(var(--color-red100));
          border-color: rgb(var(--color-red300));
          ${AlertMainStatus} {
            color: rgb(var(--color-red600));
          }
        `
      case AlertStatusCode.Success:
      default:
        return css`
          background: rgb(var(--color-green100));
          border-color: rgb(var(--color-green300));
          ${AlertMainStatus} {
            color: rgb(var(--color-green600));
          }
        `
    }
  }};
`

export default AlertMain
