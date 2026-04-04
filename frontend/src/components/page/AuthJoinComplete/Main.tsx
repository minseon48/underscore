"use client"

import Link from "next/link"
import styled from "styled-components"
import AuthView from "@/components/display/AuthView"
import Button from "@/components/general/Button"

export interface AuthJoinCompleteMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const AuthJoinCompleteMain = (props: AuthJoinCompleteMainProps) => {
  const { className = "", ...restProps } = props

  return (
    <AuthJoinCompleteMainContainer className={`${className}`} {...restProps}>
      <AuthView.Header>
        <h2>회원가입 완료</h2>
        <p>
          <span className="text-primary">홍길동</span>님, 환영합니다!
          <br />
          Underscore 서비스를 이용해보세요
        </p>
      </AuthView.Header>
      <AuthView.Action>
        <Link href="/map" passHref={true} legacyBehavior={true}>
          <Button asTag="a" variants="primary">
            지도페이지 바로가기
          </Button>
        </Link>
        <Link href="/mypage" passHref={true} legacyBehavior={true}>
          <Button asTag="a" variants="secondary">
            마이페이지 바로가기
          </Button>
        </Link>
      </AuthView.Action>
    </AuthJoinCompleteMainContainer>
  )
}

const AuthJoinCompleteMainContainer = styled(AuthView)`
  /*  */
`

export default AuthJoinCompleteMain
