"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import styled from "styled-components"
import { getCacheKey } from "@/libs/cache"
import { convertDateToString, getDiffDate } from "@/libs/utils"
import { userKey } from "@/queries/api/user"
import useSearchMembership from "@/queries/api/user/useSearchMembership"
import useMutationLeave from "@/queries/api/payment/useMutationLeave"
import MypageView from "@/components/display/MypageView"
import { MembershipOptionGroups, TypeSubscriptionCode } from "@/components/form/ChangeMembership/type"
import Alert from "@/components/feedback/Alert"
import Button from "@/components/general/Button"
import Icon from "@/components/general/Icon"
import Radio from "@/components/entry/Radio"

export interface MypageLeaveMembershipMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const CancelReasonOptions = [
  { value: "서비스가 기대와 다름", text: "서비스가 기대와 다름" },
  { value: "잘못 결제함", text: "잘못 결제함" },
  { value: "가격이 부담됨", text: "가격이 부담됨" },
  { value: "기타", text: "기타" },
]

const MypageLeaveMembershipMain = (props: MypageLeaveMembershipMainProps) => {
  const { className = "", ...restProps } = props

  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: membershipData } = useSearchMembership()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const { postLeaveAsync, postLeaveStatus } = useMutationLeave()

  const onKeep = () => {
    router.back()
  }

  const onLeaveClick = () => {
    setCancelReason("")
    setIsConfirmOpen(true)
  }

  const onConfirmLeave = async () => {
    if (!cancelReason) return

    try {
      const { paymentId } = await postLeaveAsync({ cancelReason })
      setIsConfirmOpen(false)
      router.replace(`/mypage/payment/cancel/complete?paymentId=${paymentId}`)

       queryClient.invalidateQueries({
            queryKey: getCacheKey(userKey).membership.default.toKey(),
          })
       queryClient.invalidateQueries({
            queryKey: getCacheKey(userKey).profile.default.toKey(),
          })

    } catch {
      //
    }
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
        <Button type="button" size="base" variants="secondary" isDanger={true} onClick={onLeaveClick}>
          이용권 종료
        </Button>
      </MypageView.Action>
      {isConfirmOpen && (
        <LeaveConfirmOverlay onClick={() => setIsConfirmOpen(false)}>
          <LeaveConfirmDialog onClick={(event) => event.stopPropagation()}>
            <h3>이용권을 정말 종료하시겠습니까?</h3>
            <p>종료 시 즉시 취소·환불되며 무료 이용권으로 전환됩니다.</p>
            <LeaveReasonList>
              {CancelReasonOptions.map((option) => (
                <Radio.Item key={option.value} isChecked={cancelReason === option.value}>
                  <input
                    id={`cancel-reason-${option.value}`}
                    type="radio"
                    name="cancelReason"
                    value={option.value}
                    checked={cancelReason === option.value}
                    onChange={() => setCancelReason(option.value)}
                  />
                  <label htmlFor={`cancel-reason-${option.value}`}>
                    <span>{option.text}</span>
                  </label>
                </Radio.Item>
              ))}
            </LeaveReasonList>
            <MypageView.Action>
              <Button type="button" size="base" variants="secondary" onClick={() => setIsConfirmOpen(false)}>
                취소
              </Button>
              <Button
                type="button"
                size="base"
                variants="secondary"
                isDanger={true}
                disabled={!cancelReason || postLeaveStatus === "pending"}
                onClick={onConfirmLeave}
              >
                확인
              </Button>
            </MypageView.Action>
          </LeaveConfirmDialog>
        </LeaveConfirmOverlay>
      )}
    </MypageLeaveMembershipMainContainer>
  )
}

const MypageLeaveMembershipMainAlert = styled(Alert)`
  margin-top: 16px;
`

const MypageLeaveMembershipMainContainer = styled(MypageView)`
  /*  */
`

const LeaveConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
`

const LeaveConfirmDialog = styled.div`
  width: min(420px, calc(100% - 32px));
  padding: 24px;
  background: rgb(var(--color-neutral100));
  border-radius: 12px;

  h3 {
    margin: 0 0 8px;
    font-size: ${(props) => props.theme.typo.size.lg};
    line-height: ${(props) => props.theme.typo.leading.lg};
  }

  p {
    margin: 0;
    color: rgb(var(--color-neutral700));
    font-size: ${(props) => props.theme.typo.size.sm};
    line-height: ${(props) => props.theme.typo.leading.sm};
  }
`

const LeaveReasonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
`

export default MypageLeaveMembershipMain
