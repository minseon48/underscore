"use client"

import { useForm } from "react-hook-form"
import styled from "styled-components"
import MypageView from "@/components/display/MypageView"
import ChangeMembership, { TypeChangeMembership } from "@/components/form/ChangeMembership"
import { TypeSubscriptionCode, MembershipOptionGroups } from "@/components/form/ChangeMembership/type"
import Button from "@/components/general/Button"

export interface MypageChangeMembershipMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MypageChangeMembershipMain = (props: MypageChangeMembershipMainProps) => {
  const { className = "", ...restProps } = props

  const changeMembership = useForm<TypeChangeMembership>({
    defaultValues: {
      subscription:
        MembershipOptionGroups.flatMap(({ options }) => options)?.find(
          ({ value }) => value === TypeSubscriptionCode.Free,
        )?.text ?? "",
      subscriptionCode: TypeSubscriptionCode.Free,
    },
  })

  // TODO
  const onSubmit = (data: TypeChangeMembership) => {
    console.log("onSubmit", data)
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
