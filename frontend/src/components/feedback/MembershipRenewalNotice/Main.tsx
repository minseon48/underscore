"use client"

import Link from "next/link"
import styled from "styled-components"
import Button from "@/components/general/Button"

export interface MembershipRenewalNoticeProps {
    daysLeft: number
    onClose: () => void
    }


const MembershipRenewalNotice = (props: MembershipRenewalNoticeProps) => {
    const { daysLeft, onClose } = props

    const title =
        daysLeft === 0 ? "이용권이 오늘 만료됩니다." : `이용권이 ${daysLeft}일 후 만료됩니다.`

        return (
            <Overlay onClick={onClose}>
              <Dialog onClick={(event) => event.stopPropagation()}>
                <h3>{title}</h3>
                <p>계속 이용하려면 이용권을 결제해 주세요.</p>
                <Actions>
                  <Button type="button" size="base" variants="secondary" onClick={onClose}>
                    닫기
                  </Button>
                  <Link href="/mypage/membership/change" passHref={true} legacyBehavior={true}>
                    <Button asTag="a" size="base" onClick={onClose}>
                      결제하기
                    </Button>
                  </Link>
                </Actions>
              </Dialog>
            </Overlay>
            )
        }


const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
`
const Dialog = styled.div`
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
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`
export default MembershipRenewalNotice