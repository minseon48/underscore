"use client"

import Link from "next/link"
import styled from "styled-components"
import { convertDateToString } from "@/libs/utils"
import useSearchPaymentDetail from "@/queries/api/user/useSearchPaymentDetail"
import MypageView from "@/components/display/MypageView"
import { MembershipOptionGroups } from "@/components/form/ChangeMembership/type"
import { PaymentStateOptionGroups, TypePaymentStateCode } from "@/components/form/SearchPayment"
import Button from "@/components/general/Button"

export interface MypageCancelCompleteMainProps extends React.HTMLAttributes<HTMLDivElement> {
  paymentId: number
}

const MypageCancelCompleteMain = (props: MypageCancelCompleteMainProps) => {
  const { paymentId, className = "", ...restProps } = props
  const { data: paymentData, isLoading } = useSearchPaymentDetail(paymentId)

  if (isLoading) {
    return <p>환불 내역을 불러오는 중...</p>
  }

  if (!paymentData) {
    return <p>환불 정보를 찾을 수 없습니다.</p>
  }

  const productName =
    MembershipOptionGroups.flatMap(({ options }) => options).find(
      ({ value }) => value === paymentData.subscriptionCode,
    )?.text ?? ""

  const cancelAmount = paymentData.paymentAmount

  return (
    <MypageCancelCompleteMainContainer className={`${className}`} {...restProps}>
      <MypageView.Header>
        <h2>환불이 완료되었습니다</h2>
      </MypageView.Header>
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>상품명</MypageView.Label>
          <MypageView.Text>{productName}</MypageView.Text>
        </MypageView.Group>
        <MypageView.Group>
          <MypageView.Label>결제상태</MypageView.Label>
          <MypageView.Text>
            <MypageCancelCompleteMainState data-state={`state-${paymentData.paymentState}`}>
              {PaymentStateOptionGroups.flatMap(({ options }) => options).find(
                ({ value }) => value === paymentData.paymentState,
              )?.text ?? ""}
            </MypageCancelCompleteMainState>
          </MypageView.Text>
        </MypageView.Group>
      </MypageView.Row>
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>결제일</MypageView.Label>
          <MypageView.Text>
            {paymentData.paymentDate &&
              convertDateToString(new Date(paymentData.paymentDate), "YYYY-MM-DD hh:mm:ss")}
          </MypageView.Text>
        </MypageView.Group>
        <MypageView.Group>
          <MypageView.Label>결제금액</MypageView.Label>
          <MypageView.Text>{Number(paymentData.paymentAmount).toLocaleString("ko-KR")}원</MypageView.Text>
        </MypageView.Group>
      </MypageView.Row>
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>취소일</MypageView.Label>
          <MypageView.Text>{convertDateToString(new Date(), "YYYY-MM-DD hh:mm:ss")}</MypageView.Text>
        </MypageView.Group>
        <MypageView.Group>
          <MypageView.Label>취소금액</MypageView.Label>
          <MypageView.Text>{Number(cancelAmount).toLocaleString("ko-KR")}원</MypageView.Text>
        </MypageView.Group>
      </MypageView.Row>
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>결제수단</MypageView.Label>
          <MypageView.Text>
            {paymentData.paymentMethod} {paymentData.paymentInfo}
          </MypageView.Text>
        </MypageView.Group>
      </MypageView.Row>
      <MypageView.Action>
        <Link href="/mypage/payment/history" passHref={true} legacyBehavior={true}>
          <Button asTag="a" size="base" variants="secondary">
            결제내역
          </Button>
        </Link>
        <Link href="/mypage/profile" passHref={true} legacyBehavior={true}>
          <Button asTag="a" size="base" variants="secondary" isActive={true}>
            마이페이지
          </Button>
        </Link>
      </MypageView.Action>
    </MypageCancelCompleteMainContainer>
  )
}

const MypageCancelCompleteMainState = styled.span`
  position: relative;
  padding-left: 16px;
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    transform: translateY(-50%);
    background: rgb(var(--color-neutral600));
  }
  &${`[data-state="state-${TypePaymentStateCode["CancellationComplete"]}"]`}:before {
    background: rgb(var(--color-green600));
  }
  &${`[data-state="state-${TypePaymentStateCode["PaymentCompleted"]}"]`}:before {
    background: rgb(var(--color-primary600));
  }
  &${`[data-state="state-${TypePaymentStateCode["PaymentFailed"]}"]`}:before {
    background: rgb(var(--color-red600));
  }
  &${`[data-state="state-${TypePaymentStateCode["PaymentScheduled"]}"]`}:before {
    background: rgb(var(--color-gold600));
  }
`

const MypageCancelCompleteMainContainer = styled(MypageView)`
  /*  */
`

export default MypageCancelCompleteMain
