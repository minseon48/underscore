"use client"

import Link from "next/link"
import styled from "styled-components"

export interface CopyrightMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const CopyrightMain = (props: CopyrightMainProps) => {
  const { className = "", ...restProps } = props

  return (
    <CopyrightMainContainer className={`${className}`} {...restProps}>
      <CopyrightMainRow>
        <Link href="#" passHref legacyBehavior>
          이용약관
        </Link>
        <Link href="#" passHref legacyBehavior>
          개인정보처리방침
        </Link>
      </CopyrightMainRow>
      <CopyrightMainRow>
        <span>&copy;{new Date().getFullYear()} Underscore</span>
      </CopyrightMainRow>
    </CopyrightMainContainer>
  )
}

const CopyrightMainRow = styled.div`
  a,
  span {
    padding: 0 8px;
    font-size: ${(props) => props.theme.typo.size.sm};
    line-height: ${(props) => props.theme.typo.leading.sm};
    color: rgb(var(--color-neutral800));
  }
`

const CopyrightMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`

export default CopyrightMain
