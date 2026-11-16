"use client"

import { useForm } from "react-hook-form"
import styled from "styled-components"
import useSearchSupportList, { TypeSearchSupportListResult } from "@/queries/api/user/useSearchSupportList"
import MypageView from "@/components/display/MypageView"
import SearchSupport, {
  TypeSearchSupport,
  TypeSupportRegion,
  TypeRecruitmentStatus,
  SupportRegionOptionGroups,
  RecruitmentStatusOptionGroups,
} from "@/components/form/SearchSupport"
import Table from "@/components/display/Table"
import Pagination from "@/components/navigation/Pagination"
import Button from "@/components/general/Button"

export interface MypageSupportMainProps extends React.HTMLAttributes<HTMLDivElement> {}

const formatYmd = (value?: string) => {
  if (!value || value.length !== 8) return "-"
  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`
}

const MypageSupportMain = (props: MypageSupportMainProps) => {
    const { className = "", ...restProps } = props

    const searchSupport = useForm<TypeSearchSupport>({
        defaultValues: {
            page: 1,
            size: 10,
            isFiltered: false,
            startDate: undefined,
            endDate: undefined,
            region: TypeSupportRegion.All,
            recruitmentStatus: TypeRecruitmentStatus.All,
            searchStartDate: undefined,
            searchEndDate: undefined,
            searchRegion: TypeSupportRegion.All,
            searchRecruitmentStatus: TypeRecruitmentStatus.All,
            },
        })

    const { data: supportData } = useSearchSupportList(searchSupport.watch("page"), {
        size: searchSupport.watch("size"),
        startDate: searchSupport.watch("searchStartDate"),
        endDate: searchSupport.watch("searchEndDate"),
        region: searchSupport.watch("searchRegion"),
        recruitmentStatus: searchSupport.watch("searchRecruitmentStatus"),
        })

    const onPaging = (page: number) => {
        searchSupport.setValue("page", page)
        }

    const onSubmit = (data: TypeSearchSupport) => {
        const hasDate = (value?: Date) => Boolean(value) && value !== ("" as unknown as Date)
        const isFiltered = !(
            data.region === TypeSupportRegion.All &&
            data.recruitmentStatus === TypeRecruitmentStatus.All &&
            !hasDate(data.startDate) &&
            !hasDate(data.endDate)
            )
        searchSupport.setValue("page", 1)
        searchSupport.setValue("isFiltered", isFiltered)
        searchSupport.setValue("searchStartDate", data.startDate)
        searchSupport.setValue("searchEndDate", data.endDate)
        searchSupport.setValue("searchRegion", data.region)
        searchSupport.setValue("searchRecruitmentStatus", data.recruitmentStatus)
        }

    const onOpenDetail = (record: TypeSearchSupportListResult["items"][number]) => {
        if(!record.detlPgUrl){
            alert("상세 페이지를 찾을 수 없습니다.")
            return
            }
        window.open(record.detlPgUrl, "_blank", "noopener,noreferrer")
        }

    return (
        <MypageSupportMainContainer className={`${className}`} {...restProps}>
          <MypageView.Header>
            <h2>지원사업</h2>
          </MypageView.Header>

          <MypageSupportMainForm
             formData={searchSupport}
             formAction={{ reset: "초기화", submit: "검색" }}
             formPlaceholder={{
                 startDate: "",
                 endDate: "",
                 region: "지역",
                 recruitmentStatus: "모집 진행여부",
                 }}
             formOptionGroups={{
                 region: SupportRegionOptionGroups,
                 recruitmentStatus: RecruitmentStatusOptionGroups,
                 }}
             handleValid={onSubmit}
             />

             <MypageSupportMainResult>
               {supportData && (
                   <MypageSupportMainCount>
                     {(supportData.totalCount ?? 0).toLocaleString("ko-KR")} 건
                   </MypageSupportMainCount>
               )}


{supportData && Boolean(supportData.items?.length) && (
          <Table<TypeSearchSupportListResult["items"][number]>
            data={supportData.items.map((item) => ({
              key: `${item.pbancSn}`,
              ...item,
            }))}
            columns={[
              {
                key: "bizPbancNm",
                title: "공고명",
                dataIndex: "bizPbancNm",
              },
              {
                key: "suptBizClsfc",
                title: "지원분야",
                dataIndex: "suptBizClsfc",
              },
              {
                key: "suptRegin",
                title: "지역",
                dataIndex: "suptRegin",
              },
              {
                key: "period",
                title: "접수기간",
                render: (_, { pbancRcptBgngDt, pbancRcptEndDt }) =>
                  `${formatYmd(pbancRcptBgngDt)} ~ ${formatYmd(pbancRcptEndDt)}`,
              },
              {
                key: "rcrtPrgsYn",
                title: "모집여부",
                dataIndex: "rcrtPrgsYn",
                render: (value) => {
                  if (value === "Y") return "모집중"
                  if (value === "S") return "모집예정"
                  return "마감"
                },
              },
              {
                key: "pbancNtrpNm",
                title: "주관",
                dataIndex: "pbancNtrpNm",
              },
              {
                key: "detail",
                title: "상세",
                render: (_, record) => (
                  <Button type="button" shape="plain" onClick={() => onOpenDetail(record)}>
                    상세보기
                  </Button>
                ),
              },
            ]}
          />
        )}
        {supportData && Boolean(supportData.totalCount) && (
          <Pagination
            page={searchSupport.watch("page")}
            totalPages={Math.ceil(supportData.totalCount / searchSupport.watch("size"))}
            onPaging={onPaging}
          />
        )}
      </MypageSupportMainResult>
      {supportData && (supportData.totalCount ?? 0) === 0 && !searchSupport.watch("isFiltered") && (
        <MypageView.Message>
          <strong>지원사업 공고가 없어요</strong>
        </MypageView.Message>
      )}
      {supportData && (supportData.totalCount ?? 0) === 0 && searchSupport.watch("isFiltered") && (
        <MypageView.Message>
          <strong>검색된 지원사업 공고가 없어요</strong>
          <span>검색 필터를 변경하여 다시 시도해주세요</span>
        </MypageView.Message>
      )}
    </MypageSupportMainContainer>
  )
}
const MypageSupportMainForm = styled(SearchSupport)`
  margin-top: 16px;
`
const MypageSupportMainCount = styled.p`
  margin-bottom: 12px;
  color: rgb(var(--color-primary600));
  font-weight: 600;
`
const MypageSupportMainResult = styled.div`
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
  }
  nav {
    margin-top: 16px;
  }
`
const MypageSupportMainContainer = styled(MypageView)``
export default MypageSupportMain