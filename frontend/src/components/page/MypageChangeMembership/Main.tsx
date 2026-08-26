"use client"

import { useForm } from "react-hook-form"
import styled from "styled-components"
import MypageView from "@/components/display/MypageView"
import ChangeMembership, { TypeChangeMembership } from "@/components/form/ChangeMembership"
import { TypeSubscriptionCode, MembershipOptionGroups } from "@/components/form/ChangeMembership/type"
import Button from "@/components/general/Button"
import useMutationPaymentOrder from "@/queries/api/payment/useMutationPaymentOrder"
import { requestMembershipPayment } from "@/libs/toss/requestMembershipPayment"

export interface MypageChangeMembershipMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MypageChangeMembershipMain = (props: MypageChangeMembershipMainProps) => {
  const { className = "", ...restProps } = props

  const { postPaymentOrderAsync } = useMutationPaymentOrder()

  const changeMembership = useForm<TypeChangeMembership>({
    defaultValues: {
      subscription:
        MembershipOptionGroups.flatMap(({ options }) => options)?.find(
          ({ value }) => value === TypeSubscriptionCode.Free,
        )?.text ?? "",
      subscriptionCode: TypeSubscriptionCode.Free,
    },
  })

  const onSubmit = async (data: TypeChangeMembership) => {
    if (data.subscriptionCode === TypeSubscriptionCode.Free) {
      alert("유료 이용권을 선택해주세요.")
      return
    }

    try{
        //1) 서버 주문 생성
           const order = await postPaymentOrderAsync({
              subscriptionCode: data.subscriptionCode,
            })

        //2) 토스 결제창
        await requestMembershipPayment(order)
        }catch(e){
            console.error(e)

            const code = (e as { code?: string })?.code
            if (code === "USER_CANCEL" || code === "PAY_PROCESS_CANCELED"){
                return
                }
            alert("결제창을 열지 못했습니다.")
            }

  }

  return (
    <MypageChangeMembershipMainContainer className={`${className}`} {...restProps}>
      <MypageView.Header>
        <h2>이용권 구입</h2>
      </MypageView.Header>
      <MypageChangeMembershipMainForm
        formData={changeMembership}
        formPlaceholder={{
          subscriptionCode: "이용권 선택",
        }}
        formOptionGroups={{
          subscriptionCode: MembershipOptionGroups,
        }}
        handleValid={onSubmit}
      />
      <MypageView.Action>
        <Button type="submit" form="change-membership" size="base" variants="secondary" isActive={true}>
          이용권 구입
        </Button>
      </MypageView.Action>
    </MypageChangeMembershipMainContainer>
  )
}

const MypageChangeMembershipMainForm = styled(ChangeMembership)`
  margin-top: 16px;
`

const MypageChangeMembershipMainContainer = styled(MypageView)`
  /*  */
`

export default MypageChangeMembershipMain
