"use client"

import Link from "next/link"
import styled from "styled-components"
import MypageView from "@/components/display/MypageView"
import { convertDateToString } from "@/libs/utils"
import useSearchMembership from "@/queries/api/user/useSearchMembership"
import useSearchProfile from "@/queries/api/user/useSearchProfile"
import { MembershipOptionGroups, TypeSubscriptionCode } from "@/components/form/ChangeMembership/type"
import Button from "@/components/general/Button"

export interface MypageProfileMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MypageProfileMain = (props: MypageProfileMainProps) => {
  const { className = "", ...restProps } = props

  const { data: profileData } = useSearchProfile()
  const { data: membershipData } = useSearchMembership()

  return (
    <MypageProfileMainContainer className={`${className}`} {...restProps}>
      <MypageView.Header>
        <h2>회원정보</h2>
      </MypageView.Header>
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>이름</MypageView.Label>
          <MypageView.Text>{profileData?.name}</MypageView.Text>
        </MypageView.Group>
        <MypageView.Group>
          <MypageView.Label>이메일</MypageView.Label>
          <MypageView.Text>{profileData?.email}</MypageView.Text>
        </MypageView.Group>
      </MypageView.Row>
      <MypageView.Action>
        <Link href="/auth/profile/edit" passHref={true} legacyBehavior={true}>
          <Button asTag="a" size="base" variants="secondary">
            회원정보 수정
          </Button>
        </Link>
      </MypageView.Action>
      <MypageView.Header>
        <h2>이용권 관리</h2>
      </MypageView.Header>
      <MypageView.Row>
        <MypageView.Group column={2}>
          <MypageView.Label>사용 중인 이용권</MypageView.Label>
          {membershipData?.subscriptionCode === TypeSubscriptionCode.Free && (
            <MypageView.Text>
              {MembershipOptionGroups.flatMap(({ options }) => options)?.find(
                ({ value }) => value === TypeSubscriptionCode.Free,
              )?.text ?? ""}
            </MypageView.Text>
          )}
          {membershipData?.subscriptionCode === TypeSubscriptionCode.Month && (
            <MypageView.Text>
              {MembershipOptionGroups.flatMap(({ options }) => options)?.find(
                ({ value }) => value === TypeSubscriptionCode.Month,
              )?.text ?? ""}
            </MypageView.Text>
          )}
          {membershipData?.subscriptionCode === TypeSubscriptionCode.Year && (
            <MypageView.Text>
              {MembershipOptionGroups.flatMap(({ options }) => options)?.find(
                ({ value }) => value === TypeSubscriptionCode.Year,
              )?.text ?? ""}
            </MypageView.Text>
          )}
          {membershipData?.effectiveDate && membershipData?.expirationDate && (
            <MypageView.Text>
              {`유효기간 ${convertDateToString(new Date(membershipData?.effectiveDate))} ~ ${convertDateToString(new Date(membershipData?.expirationDate))}`}
            </MypageView.Text>
          )}
          {membershipData?.paymentAmount && (
            <MypageView.Text>결제금액 {membershipData?.paymentAmount?.toLocaleString("ko-KR")}원</MypageView.Text>
          )}
        </MypageView.Group>
      </MypageView.Row>
      <MypageView.Action>
        <Link href="/mypage/payment/history" passHref={true} legacyBehavior={true}>
          <Button asTag="a" size="base" variants="secondary">
            결제내역
          </Button>
        </Link>
        {membershipData?.subscriptionCode === TypeSubscriptionCode.Free && (
          <Link href="/mypage/membership/change" passHref={true} legacyBehavior={true}>
            <Button asTag="a" size="base" variants="secondary">
              이용권 변경
            </Button>
          </Link>
        )}
        {membershipData?.subscriptionCode === TypeSubscriptionCode.Month && (
          <Link href="/mypage/membership/change" passHref={true} legacyBehavior={true}>
            <Button asTag="a" size="base" variants="secondary">
              이용권 종료
            </Button>
          </Link>
        )}
        {membershipData?.subscriptionCode === TypeSubscriptionCode.Year && (
          <Link href="/mypage/membership/change" passHref={true} legacyBehavior={true}>
            <Button asTag="a" size="base" variants="secondary">
              이용권 종료
            </Button>
          </Link>
        )}
      </MypageView.Action>
    </MypageProfileMainContainer>
  )
}

const MypageProfileMainContainer = styled(MypageView)`
  /*  */
`

export default MypageProfileMain