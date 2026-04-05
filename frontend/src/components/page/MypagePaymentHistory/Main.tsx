"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import styled from "styled-components"
import { convertDateToString } from "@/libs/utils"
import useSearchPaymentList, { TypeSearchPaymentListResult } from "@/queries/api/user/useSearchPaymentList"
import MypageView from "@/components/display/MypageView"
import SearchPayment, {
  TypeSearchPayment,
  PaymentPeriodOptionGroups,
  PaymentStateOptionGroups,
  TypePaymentPeriodCode,
  TypePaymentStateCode,
} from "@/components/form/SearchPayment"
import { MembershipOptionGroups } from "@/components/form/ChangeMembership/type"
import Table from "@/components/display/Table"
import Pagination from "@/components/navigation/Pagination"
import Button from "@/components/general/Button"

export interface MypagePaymentHistoryMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MypagePaymentHistoryMain = (props: MypagePaymentHistoryMainProps) => {
  const { className = "", ...restProps } = props

  // TODO
  const searchPayment = useForm<TypeSearchPayment>({
    defaultValues: {
      page: 1,
      size: 10,
      isFiltered: false,
      paymentStateCode: TypePaymentStateCode["All"],
      paymentPeriodCode: TypePaymentPeriodCode["All"],
      startDate: undefined,
      endDate: undefined,
      searchPaymentStateCode: TypePaymentStateCode["All"],
      searchPaymentPeriodCode: TypePaymentPeriodCode["All"],
      searchStartDate: undefined,
      searchEndDate: undefined,
    },
  })

  const { data: paymentData } = useSearchPaymentList(searchPayment.watch("page"), {
    size: searchPayment.watch("size"),
    paymentStateCode: searchPayment.watch("searchPaymentStateCode"),
    paymentPeriodCode: searchPayment.watch("searchPaymentPeriodCode"),
    startDate: searchPayment.watch("searchStartDate"),
    endDate: searchPayment.watch("searchEndDate"),
  })

  // TODO
  const onReceipt = (record: TypeSearchPaymentListResult["items"][number]) => {
    console.log("onReceipt", record)
  }

  const onPaging = (page: number) => {
    searchPayment.setValue("page", page)
  }

  const onSubmit = (data: TypeSearchPayment) => {
    const isFiltered = !(
      data?.paymentStateCode === TypePaymentStateCode["All"] &&
      data?.paymentStateCode === TypePaymentPeriodCode["All"] &&
      data?.startDate === ("" as unknown as Date) &&
      data?.endDate === ("" as unknown as Date)
    )
    searchPayment.setValue("page", 1)
    searchPayment.setValue("isFiltered", isFiltered)
    searchPayment.setValue("searchPaymentStateCode", data?.paymentStateCode)
    searchPayment.setValue("searchPaymentPeriodCode", data?.paymentPeriodCode)
    searchPayment.setValue("searchStartDate", data?.startDate)
    searchPayment.setValue("searchEndDate", data?.endDate)
  }

  return (
    <MypagePaymentHistoryMainContainer className={`${className}`} {...restProps}>
      <MypageView.Header>
        <h2>결제내역</h2>
      </MypageView.Header>
      <MypagePaymentHistoryMainForm
        formData={searchPayment}
        formAction={{
          reset: "초기화",
          submit: "조회",
        }}
        formPlaceholder={{
          startDate: "",
          endDate: "",
        }}
        formOptionGroups={{
          paymentStateCode: PaymentStateOptionGroups,
          paymentPeriodCode: PaymentPeriodOptionGroups,
        }}
        handleValid={onSubmit}
      />
      <MypagePaymentHistoryMainResult>
        {paymentData && Boolean(paymentData?.items?.length) && (
          <Table<TypeSearchPaymentListResult["items"][number]>
            data={paymentData?.items?.map((item) => ({
              key: `${item.id}`,
              ...item,
            }))}
            columns={[
              {
                key: "id",
                title: "주문번호",
                dataIndex: "id",
              },
              {
                key: "subscriptionCode",
                title: "결제항목",
                dataIndex: "subscriptionCode",
                render: (_, { subscriptionCode, effectiveDate, expirationDate }) => {
                  const name =
                    MembershipOptionGroups.flatMap(({ options }) => options)?.find(
                      ({ value }) => value === subscriptionCode,
                    )?.text ?? ""
                  return (
                    <>
                      <strong>{name}</strong>
                      <span>
                        {`유효기간: ${convertDateToString(new Date(effectiveDate))} ~ ${convertDateToString(new Date(expirationDate))}`}
                      </span>
                    </>
                  )
                },
              },
              {
                key: "paymentMethod",
                title: "결제수단",
                dataIndex: "paymentMethod",
              },
              {
                key: "paymentDate",
                title: "결제일",
                dataIndex: "paymentDate",
                render: (paymentDate) => `${convertDateToString(new Date(paymentDate))}`,
              },
              {
                key: "paymentState",
                title: "결제상태",
                dataIndex: "paymentState",
                render: (paymentState) => {
                  const name =
                    PaymentStateOptionGroups.flatMap(({ options }) => options)?.find(
                      ({ value }) => value === paymentState,
                    )?.text ?? ""
                  return (
                    <MypagePaymentHistoryMainState data-state={`state-${paymentState}`}>
                      {name}
                    </MypagePaymentHistoryMainState>
                  )
                },
              },
              {
                key: "billingDate",
                title: "청구일",
                dataIndex: "billingDate",
                render: (billingDate) => `${convertDateToString(new Date(billingDate))}`,
              },
              {
                key: "paymentAmount",
                title: "결제금액",
                dataIndex: "paymentAmount",
                render: (paymentAmount) => `${parseInt(`${paymentAmount}`)?.toLocaleString("ko-KR")}원`,
              },
              {
                key: "information",
                title: "결제정보",
                // dataIndex: "information",
                render: (_, { id }) => (
                  <Link href={`/mypage/payment/history/${id}`} passHref={true} legacyBehavior={true}>
                    <Button asTag="a" shape="plain">
                      결제정보 보기
                    </Button>
                  </Link>
                ),
              },
              {
                key: "receipt",
                title: "영수증",
                // dataIndex: "receipt",
                render: (_, record) => (
                  <Button type="button" shape="plain" onClick={() => onReceipt(record)}>
                    영수증 보기
                  </Button>
                ),
              },
            ]}
          />
        )}
        {paymentData && Boolean(paymentData?.totalCount) && (
          <Pagination
            page={searchPayment.watch("page")}
            totalPages={Math.ceil(paymentData.totalCount / searchPayment.watch("size"))}
            onPaging={onPaging}
          />
        )}
      </MypagePaymentHistoryMainResult>
      {paymentData && (paymentData?.totalCount ?? 0) === 0 && !searchPayment.watch("isFiltered") && (
        <MypageView.Message>
          <strong>결제 내역이 없어요</strong>
        </MypageView.Message>
      )}
      {paymentData && (paymentData?.totalCount ?? 0) === 0 && searchPayment.watch("isFiltered") && (
        <MypageView.Message>
          <strong>검색된 결제 내역이 없어요</strong>
          <span>검색 필터를 변경하여 다시 시도해주세요</span>
        </MypageView.Message>
      )}
    </MypagePaymentHistoryMainContainer>
  )
}

const MypagePaymentHistoryMainForm = styled(SearchPayment)`
  margin-top: 16px;
`

const MypagePaymentHistoryMainState = styled.span`
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

const MypagePaymentHistoryMainResult = styled.div`
  margin-top: 16px;
  > div:has(table) {
    overflow-x: auto;
  }
  table {
    white-space: nowrap;
    table-layout: auto;
    th,
    td {
      vertical-align: middle;
    }
    strong + span {
      display: block;
    }
  }
  nav {
    margin-top: 16px;
  }
`

const MypagePaymentHistoryMainContainer = styled(MypageView)`
  /*  */
`

export default MypagePaymentHistoryMain
