"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import styled from "styled-components"
import { convertDateToString, getDiffDate } from "@/libs/utils"
import useSearchMembership from "@/queries/api/user/useSearchMembership"
import MypageView from "@/components/display/MypageView"
import { MembershipOptionGroups, TypeSubscriptionCode } from "@/components/form/ChangeMembership/type"
import Alert from "@/components/feedback/Alert"
import Button from "@/components/general/Button"
import Icon from "@/components/general/Icon"

export interface MypageLeaveMembershipMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MypageLeaveMembershipMain = (props: MypageLeaveMembershipMainProps) => {
  const { className = "", ...restProps } = props

  const router = useRouter()
  const { data: membershipData } = useSearchMembership()

  const onKeep = () => {
    router.back()
  }

  // TODO
  const onLeave = () => {
    console.log("onLeave")
  }

  return (
    <MypageLeaveMembershipMainContainer className={`${className}`} {...restProps}>
      <MypageView.Header>
        <h2>이용권 종료</h2>
      </MypageView.Header>
      <MypageLeaveMembershipMainAlert statusCode="error" statusMessage="sdf" hasIcon={true}>
        이용권 종료 시, 현재 사용 중인 이용권이 즉시 취소·환불되며 무료 이용권으로 전환됩니다. <br />
        <Link href="#" passHref={true} legacyBehavior={true}>
          <Button asTag="a" shape="plain" suffixEl={<Icon name="ArrowRight" aria-hidden={true} />}>
            환불규정 확인
          </Button>
        </Link>
      </MypageLeaveMembershipMainAlert>
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>사용중인 이용권</MypageView.Label>
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
        </MypageView.Group>
        <MypageView.Group>
          <MypageView.Label>유효기간</MypageView.Label>
          {membershipData?.effectiveDate && membershipData?.expirationDate && (
            <MypageView.Text>
              {`${convertDateToString(new Date(membershipData?.effectiveDate))} ~ ${convertDateToString(new Date(membershipData?.expirationDate))}`}
            </MypageView.Text>
          )}
        </MypageView.Group>
      </MypageView.Row>
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>결제수단</MypageView.Label>
          <MypageView.Text>
            {membershipData?.paymentMethod} {membershipData?.paymentInfo}
          </MypageView.Text>
        </MypageView.Group>
        <MypageView.Group>
          <MypageView.Label>사용일수</MypageView.Label>
          <MypageView.Text>
            {membershipData?.effectiveDate && `${getDiffDate(new Date(membershipData?.effectiveDate), new Date())}일`}
          </MypageView.Text>
        </MypageView.Group>
      </MypageView.Row>
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>결제금액</MypageView.Label>
          <MypageView.Text>{`${parseInt(`${membershipData?.paymentAmount}`)?.toLocaleString("ko-KR")}원`}</MypageView.Text>
        </MypageView.Group>
        <MypageView.Group>
          <MypageView.Label>환불금액</MypageView.Label>
          <MypageView.Text>{`${parseInt(`${membershipData?.refundAmount}`)?.toLocaleString("ko-KR")}원`}</MypageView.Text>
        </MypageView.Group>
      </MypageView.Row>
      <MypageView.Action>
        <Button type="button" size="base" variants="secondary" isActive={true} onClick={onKeep}>
          이용권 유지
        </Button>
        <Button type="button" size="base" variants="secondary" isDanger={true} onClick={onLeave}>
          이용권 종료
        </Button>
      </MypageView.Action>
    </MypageLeaveMembershipMainContainer>
  )
}

const MypageLeaveMembershipMainAlert = styled(Alert)`
  margin-top: 16px;
`

const MypageLeaveMembershipMainContainer = styled(MypageView)`
  /*  */
`

export default MypageLeaveMembershipMain
