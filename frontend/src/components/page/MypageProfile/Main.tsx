"use client"

import Link from "next/link"
import styled from "styled-components"
import MypageView from "@/components/display/MypageView"
import { convertDateToString } from "@/libs/utils"
import Alert, { AlertStatusCode } from "@/components/feedback/Alert"

import useInitToken from "@/libs/hook/useInitToken"
import useSearchMembership from "@/queries/api/user/useSearchMembership"
import useSearchProfile from "@/queries/api/user/useSearchProfile"
import { MembershipOptionGroups, TypeSubscriptionCode } from "@/components/form/ChangeMembership/type"
import Button from "@/components/general/Button"

export interface MypageProfileMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MypageProfileMain = (props: MypageProfileMainProps) => {
  const { className = "", ...restProps } = props

  const { tokenReady } = useInitToken()
  const { data: profileData } = useSearchProfile({ enabled: tokenReady})
  const { data: membershipData } = useSearchMembership()

  const showRenewalNotice = membershipData?.showRenewalNotice === true
  const daysLeft = membershipData?.daysUntilExpiration ?? 0

  const renewalMessage =
    daysLeft === 0
      ? "이용권이 오늘 만료됩니다. 연장하지 않으면 무료 이용권으로 전환됩니다."
      : `이용권이 ${daysLeft}일 후 만료됩니다. 지금 연장하면 남은 기간에 이어서 이용할 수 있어요.`

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
        </MypageView.Group>
      </MypageView.Row>
      {showRenewalNotice && (
        <RenewalAlert statusCode={AlertStatusCode.Warning} statusMessage="이용권 만료 안내" hasIcon={true}>
          {renewalMessage}
        </RenewalAlert>
      )}
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
        {showRenewalNotice && (
          <Link href="/mypage/membership/change?intent=renew" passHref={true} legacyBehavior={true}>
            <Button asTag="a" size="base" variants="secondary">
              이용권 연장
            </Button>
          </Link>
        )}
        {(membershipData?.subscriptionCode === TypeSubscriptionCode.Month ||
          membershipData?.subscriptionCode === TypeSubscriptionCode.Year) && (
          <Link href="/mypage/membership/change?intent=leave" passHref={true} legacyBehavior={true}>
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

const RenewalAlert = styled(Alert)`
  margin: 12px 0 0;
`
export default MypageProfileMain