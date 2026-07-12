import { TypeSearchAnalysisReportResult } from "@/queries/api/map/useSearchAnalysisReport"

export type ReportRow = {
    label: string
    value: string | number
}

export type ReportSectionConfig = {
    key: string //Nav 식별자
    title: string //한글 제목
    scoreIndex: number //businessAttractionScores[i]와 매칭
    getRows: (data: TypeSearchAnalysisReportResult) => ReportRow[]
}

const formatNumber = (value: number) => value.toLocaleString("ko-KR")

export const REPORT_SECTIONS: ReportSectionConfig[] = [
    {
      key: "floating",
      title: "유동인구",
      scoreIndex: 0, // labels[0] = "Floating Population"
      getRows: (data) => {
          const info = data.floatingPopulationInfo
          return [
                  { label: "총 유동인구", value: formatNumber(info.totalFloatingPopulationCount) },
                  { label: "10대", value: formatNumber(info.ageGrade10FloatingPopulationCount) },
                  { label: "20대", value: formatNumber(info.ageGrade20FloatingPopulationCount) },
                  { label: "30대", value: formatNumber(info.ageGrade30FloatingPopulationCount) },
                  { label: "40대", value: formatNumber(info.ageGrade40FloatingPopulationCount) },
                  { label: "50대", value: formatNumber(info.ageGrade50FloatingPopulationCount) },
                  { label: "60대 이상", value: formatNumber(info.ageGrade60AndAboveFloatingPopulationCount) },
                  { label: "월요일", value: formatNumber(info.mondayFloatingPopulationCount) },
                  { label: "화요일", value: formatNumber(info.tuesdayFloatingPopulationCount) },
                  { label: "수요일", value: formatNumber(info.wednesdayFloatingPopulationCount) },
                  { label: "목요일", value: formatNumber(info.thursdayFloatingPopulationCount) },
                  { label: "금요일", value: formatNumber(info.fridayFloatingPopulationCount) },
                  { label: "토요일", value: formatNumber(info.saturdayFloatingPopulationCount) },
                  { label: "일요일", value: formatNumber(info.sundayFloatingPopulationCount) },
                ]
          },
        },
    {
      key: "stores",
      title: "점포",
      scoreIndex: 1,
      getRows: (data) => {
          if(!data.storeInfo){
              return [{ label: "안내", value: "점포 데이터가 없습니다"}]
              }
          const info = data.storeInfo
          return [
                  { label: "유사 업종 점포 수", value: formatNumber(info.similarIndustryStoreCount) },
                  { label: "개업 점포 수", value: formatNumber(info.openingBusinessStoreCount) },
                  { label: "개업률", value: `${info.openingBusinessRate}%` },
                  { label: "폐업 점포 수", value: formatNumber(info.closingBusinessStoreCount) },
                  { label: "폐업률", value: `${info.closingBusinessRate}%` },
                ]
          },
        },

    {
      key: "income",
      title: "지출",
      scoreIndex: 2,
      getRows: (data) => [
          {
            label: "식료품 지출액",
            value: formatNumber(Number(data.incomeConsumptionInfo.foodExpenditureAmount)),
              },
          ],
        },
    {
      key: "resident",
      title: "상주인구",
      scoreIndex: 3,
      getRows: (data) => {
          const info = data.reportResidentPopulationInfo
          return [
                { label: "총 상주인구", value: formatNumber(info.totalResidentPopulationCount) },
                { label: "남성 10대", value: formatNumber(info.maleAge10ResidentPopulationCount) },
                { label: "남성 20대", value: formatNumber(info.maleAge20ResidentPopulationCount) },
                { label: "남성 30대", value: formatNumber(info.maleAge30ResidentPopulationCount) },
                { label: "남성 40대", value: formatNumber(info.maleAge40ResidentPopulationCount) },
                { label: "남성 50대", value: formatNumber(info.maleAge50ResidentPopulationCount) },
                { label: "남성 60대 이상", value: formatNumber(info.maleAge60AndAboveResidentPopulationCount) },
                { label: "여성 10대", value: formatNumber(info.femaleAge10ResidentPopulationCount) },
                { label: "여성 20대", value: formatNumber(info.femaleAge20ResidentPopulationCount) },
                { label: "여성 30대", value: formatNumber(info.femaleAge30ResidentPopulationCount) },
                { label: "여성 40대", value: formatNumber(info.femaleAge40ResidentPopulationCount) },
                { label: "여성 50대", value: formatNumber(info.femaleAge50ResidentPopulationCount) },
                { label: "여성 60대 이상", value: formatNumber(info.femaleAge60AndAboveResidentPopulationCount) },
              ]
          },
        },

    {
      key: "index",
      title: "상권",
      scoreIndex: 4,
      getRows: (data) => {
          const info = data.indexQuarterlyQuotientInfo
          return [
                  { label: "상권변화 지표", value: info.tradeAreaChangeIndex },
                  { label: "상권변화 지표명", value: info.tradeAreaChangeIndexName },
                  { label: "운영 개월 평균", value: formatNumber(info.operatingBusinessMonthAverage) },
                  { label: "폐업 개월 평균", value: formatNumber(info.closedBusinessMonthAverage) },
                  { label: "서울 운영 개월 평균", value: formatNumber(info.seoulOperatingBusinessMonthAverage) },
                  { label: "서울 폐업 개월 평균", value: formatNumber(info.seoulClosedBusinessMonthAverage) },
                ]
          },
        },
    {
      key: "selling",
      title: "매출",
      scoreIndex: 5,
      getRows: (data) => {
          if(!data.sellingInfo) {
              return [{ label: "안내", value: "매출 데이터가 없습니다." }]
              }
          const info = data.sellingInfo
          return [
                { label: "당월 매출 금액", value: formatNumber(Number(info.thisMonthSellingAmount)) },
                { label: "당월 매출 건수", value: formatNumber(info.thisMonthSellingCount) },
                { label: "주중 매출 건수", value: formatNumber(info.midweekSellingCount) },
                { label: "주말 매출 건수", value: formatNumber(info.weekendSellingCount) },
                { label: "월요일 매출 건수", value: formatNumber(info.mondaySellingCount) },
                { label: "화요일 매출 건수", value: formatNumber(info.tuesdaySellingCount) },
                { label: "수요일 매출 건수", value: formatNumber(info.wednesdaySellingCount) },
                { label: "목요일 매출 건수", value: formatNumber(info.thursdaySellingCount) },
                { label: "금요일 매출 건수", value: formatNumber(info.fridaySellingCount) },
                { label: "토요일 매출 건수", value: formatNumber(info.saturdaySellingCount) },
                { label: "일요일 매출 건수", value: formatNumber(info.sundaySellingCount) },
                { label: "남성 매출 건수", value: formatNumber(info.maleSellingCount) },
                { label: "여성 매출 건수", value: formatNumber(info.femaleSellingCount) },
                { label: "10대 매출 건수", value: formatNumber(info.ageGrade10SellingCount) },
                { label: "20대 매출 건수", value: formatNumber(info.ageGrade20SellingCount) },
                { label: "30대 매출 건수", value: formatNumber(info.ageGrade30SellingCount) },
                { label: "40대 매출 건수", value: formatNumber(info.ageGrade40SellingCount) },
                { label: "50대 매출 건수", value: formatNumber(info.ageGrade50SellingCount) },
                { label: "60대 이상 매출 건수", value: formatNumber(info.ageGrade60AndAboveSellingCount) },
              ]
          },
        },
    ]