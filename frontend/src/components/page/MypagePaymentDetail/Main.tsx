"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import styled from "styled-components"
import { convertDateToString } from "@/libs/utils"
import useSearchPaymentDetail from "@/queries/api/user/useSearchPaymentDetail"
import MypageView from "@/components/display/MypageView"
import { PaymentStateOptionGroups, TypePaymentStateCode } from "@/components/form/SearchPayment"
import { MembershipOptionGroups } from "@/components/form/ChangeMembership/type"
import Button from "@/components/general/Button"

export interface MypagePaymentDetailMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MypagePaymentDetailMain = (props: MypagePaymentDetailMainProps) => {
  const { className = "", ...restProps } = props

  const params = useParams()
  const { data: paymentData } = useSearchPaymentDetail(parseInt(`${params?.paymentId ?? 0}`))

  // TODO
  const onRetry = () => {
    console.log("onRetry")
  }

  return (
    <MypagePaymentDetailMainContainer className={`${className}`} {...restProps}>
      <MypageView.Header>
        <h2>결제정보</h2>
      </MypageView.Header>
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>주문번호</MypageView.Label>
          <MypageView.Text>{paymentData?.id}</MypageView.Text>
        </MypageView.Group>
        <MypageView.Group>
          <MypageView.Label>결제시간</MypageView.Label>
          <MypageView.Text>
            {paymentData?.paymentDate &&
              `${convertDateToString(new Date(paymentData?.paymentDate), "YYYY-MM-DD hh:mm:ss")}`}
          </MypageView.Text>
        </MypageView.Group>
      </MypageView.Row>
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>결제수단</MypageView.Label>
          <MypageView.Text>
            {paymentData?.paymentMethod} {paymentData?.paymentInfo}
          </MypageView.Text>
        </MypageView.Group>
        <MypageView.Group>
          <MypageView.Label>결제상태</MypageView.Label>
          <MypageView.Text>
            <MypagePaymentDetailMainState data-state={`state-${paymentData?.paymentState}`}>
              {PaymentStateOptionGroups.flatMap(({ options }) => options)?.find(
                ({ value }) => value === paymentData?.paymentState,
              )?.text ?? ""}
            </MypagePaymentDetailMainState>
          </MypageView.Text>
        </MypageView.Group>
      </MypageView.Row>
      {paymentData?.paymentState === TypePaymentStateCode["PaymentFailed"] && (
        <MypageView.Row>
          <MypageView.Group>
            <MypageView.Label>실패사유</MypageView.Label>
            <MypageView.Text>
              [오류코드:{paymentData?.errorCode}] {paymentData?.errorMessage}
            </MypageView.Text>
          </MypageView.Group>
          <MypageView.Group>
            <MypageView.Label>문의안내</MypageView.Label>
            <MypageView.Text>
              <Button asTag="a" href="mailto:admin@underscore.or.kr" target="_blank" shape="plain" variants="secondary">
                admin@underscore.or.kr
              </Button>
            </MypageView.Text>
          </MypageView.Group>
        </MypageView.Row>
      )}
      <MypageView.Row>
        <MypageView.Group>
          <MypageView.Label>결제항목</MypageView.Label>
          <MypageView.Text>
            <strong>
              {MembershipOptionGroups.flatMap(({ options }) => options)?.find(
                ({ value }) => value === paymentData?.subscriptionCode,
              )?.text ?? ""}
            </strong>
            <span>
              {paymentData?.effectiveDate &&
                paymentData?.expirationDate &&
                `유효기간: ${convertDateToString(new Date(paymentData?.effectiveDate))} ~ ${convertDateToString(new Date(paymentData?.expirationDate))}`}
            </span>
          </MypageView.Text>
        </MypageView.Group>
        <MypageView.Group>
          <MypageView.Label>결제금액</MypageView.Label>
          <MypageView.Text>{parseInt(`${paymentData?.paymentAmount}`)?.toLocaleString("ko-KR")}원</MypageView.Text>
        </MypageView.Group>
      </MypageView.Row>
      {/* TODO */}
      <MypageView.Action>
        <Button type="button" variants="secondary" isActive={true} onClick={onRetry}>
          다시 결제하기
        </Button>
        <Link href="/mypage/payment/history" passHref={true} legacyBehavior={true}>
          <Button asTag="a" variants="secondary">
            결제내역
          </Button>
        </Link>
      </MypageView.Action>
    </MypagePaymentDetailMainContainer>
  )
}

const MypagePaymentDetailMainState = styled.span`
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

const MypagePaymentDetailMainContainer = styled(MypageView)`
  /*  */
`

export default MypagePaymentDetailMain
