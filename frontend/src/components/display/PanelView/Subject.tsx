"use client"

import styled, { css } from "styled-components"
import { PanelViewSubjectStatusCode } from "@/components/display/PanelView/type"
import Icon from "@/components/general/Icon"

export interface PanelViewSubjectProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  statusCode: PanelViewSubjectStatusCode
  statusMessage: string
  hasIcon: boolean
  count?: number
  suffixEl?: React.ReactNode
}

const PanelViewSubject = (props: PanelViewSubjectProps) => {
  const { statusCode, statusMessage, hasIcon, count, suffixEl = null, className = "", children, ...restProps } = props

  return (
    <PanelViewSubjectContainer $statusCode={statusCode} className={`${className}`} {...restProps}>
      <PanelViewSubjectContent>{children}</PanelViewSubjectContent>
      {hasIcon && (
        <PanelViewSubjectStatus>
          {statusCode === PanelViewSubjectStatusCode.Loading && <Icon name="Loading" aria-hidden={true} />}
          {statusCode === PanelViewSubjectStatusCode.Success && <Icon name="CheckCircle" aria-hidden={true} />}
          {statusCode === PanelViewSubjectStatusCode.Warning && <Icon name="ExclamationCircle" aria-hidden={true} />}
          <span className="sr-only">{statusMessage}</span>
        </PanelViewSubjectStatus>
      )}
      {!Number.isNaN(count) && <PanelViewSubjectCount>{count}</PanelViewSubjectCount>}
      {suffixEl && <span className="extra-suffix">{suffixEl}</span>}
    </PanelViewSubjectContainer>
  )
}

interface PanelViewSubjectStyled {
  $statusCode: PanelViewSubjectProps["statusCode"]
}

const PanelViewSubjectContent = styled.strong`
  flex: none;
  font-weight: 500;
`

const PanelViewSubjectStatus = styled.div`
  flex: none;
`

const PanelViewSubjectCount = styled.div`
  color: rgb(var(--color-neutral700));
`

const PanelViewSubjectContainer = styled.div<PanelViewSubjectStyled>`
  position: sticky;
  top: 0;
  left: 0;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 38px;
  padding: 0 20px;
  font-size: ${(props) => props.theme.typo.size.sm};
  line-height: ${(props) => props.theme.typo.leading.sm};
  background: rgb(var(--color-neutral100));
  border-bottom: 1px solid rgb(var(--color-neutral400));
  z-index: 1;
  .extra-suffix {
    flex: 1 1 0px;
    display: inline-flex;
    justify-content: flex-end;
  }
  ${(props) => {
    switch (props.$statusCode) {
      case PanelViewSubjectStatusCode.Warning:
        return css`
          ${PanelViewSubjectStatus} {
            color: rgb(var(--color-gold500));
          }
        `
      case PanelViewSubjectStatusCode.Loading:
      case PanelViewSubjectStatusCode.Success:
      default:
        return css`
          ${PanelViewSubjectStatus} {
            color: rgb(var(--color-primary600));
          }
        `
    }
  }}
`

export default PanelViewSubject
