import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { getCacheKey, getToken } from "@/libs/cache"
import { TypeAnalysisReportFilter, mapKey } from "@/queries/api/map"

export type TypeSearchAnalysisReportResult = {
    errorMessage?: string
    id: number
    address: string
    administrativeCode?: string
    labels: [string, string, string, string, string, string]
    businessAttractionScores: [number, number, number, number, number, number]
    totalScore: number
    serviceIndustryCode: string
    serviceIndustryName: string
    floatingPopulationInfo: {
        totalFloatingPopulationCount: number
        ageGrade10FloatingPopulationCount: number
        ageGrade20FloatingPopulationCount: number
        ageGrade30FloatingPopulationCount: number
        ageGrade40FloatingPopulationCount: number
        ageGrade50FloatingPopulationCount: number
        ageGrade60AndAboveFloatingPopulationCount: number
        mondayFloatingPopulationCount: number
        tuesdayFloatingPopulationCount: number
        wednesdayFloatingPopulationCount: number
        thursdayFloatingPopulationCount: number
        fridayFloatingPopulationCount: number
        saturdayFloatingPopulationCount: number
        sundayFloatingPopulationCount: number
      }
      incomeConsumptionInfo: {
        foodExpenditureAmount: number
      }
      indexQuarterlyQuotientInfo: {
        tradeAreaChangeIndex: string
        tradeAreaChangeIndexName: string
        operatingBusinessMonthAverage: number
        closedBusinessMonthAverage: number
        seoulOperatingBusinessMonthAverage: number
        seoulClosedBusinessMonthAverage: number
      }
      reportResidentPopulationInfo: {
        totalResidentPopulationCount: number
        maleAge10ResidentPopulationCount: number
        maleAge20ResidentPopulationCount: number
        maleAge30ResidentPopulationCount: number
        maleAge40ResidentPopulationCount: number
        maleAge50ResidentPopulationCount: number
        maleAge60AndAboveResidentPopulationCount: number
        femaleAge10ResidentPopulationCount: number
        femaleAge20ResidentPopulationCount: number
        femaleAge30ResidentPopulationCount: number
        femaleAge40ResidentPopulationCount: number
        femaleAge50ResidentPopulationCount: number
        femaleAge60AndAboveResidentPopulationCount: number
      }
      storeInfo?: {
        similarIndustryStoreCount: number
        openingBusinessRate: number
        openingBusinessStoreCount: number
        closingBusinessRate: number
        closingBusinessStoreCount: number
      }
      sellingInfo?: {
        thisMonthSellingAmount: number
        thisMonthSellingCount: number
        midweekSellingCount: number
        weekendSellingCount: number
        mondaySellingCount: number
        tuesdaySellingCount: number
        wednesdaySellingCount: number
        thursdaySellingCount: number
        fridaySellingCount: number
        saturdaySellingCount: number
        sundaySellingCount: number
        maleSellingCount: number
        femaleSellingCount: number
        ageGrade10SellingCount: number
        ageGrade20SellingCount: number
        ageGrade30SellingCount: number
        ageGrade40SellingCount: number
        ageGrade50SellingCount: number
        ageGrade60AndAboveSellingCount: number
      }
    }


//post 호출
export const fetchSearchAnalysisReport = async ({
    administrativeCode,
    businessCode,
    }: TypeAnalysisReportFilter) => {
        const token = await getToken()
        const { data } = await axios.post<TypeSearchAnalysisReportResult>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/map/business-attraction-report`,
            {
                administrativeCode,
                serviceIndustryCode: businessCode,
                },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    },
                },
            )
        return data
        }

    const useSearchAnalysisReport = (
        { administrativeCode, businessCode }: TypeAnalysisReportFilter,
        options?: { enabled?: boolean },
        ) => {
            const context = useQuery({
                queryKey: getCacheKey(mapKey).analysis.report.detail.toKeyWithArgs(
                    administrativeCode,
                    businessCode,
                    ),
                queryFn: async () => {
                    const data = await fetchSearchAnalysisReport({ administrativeCode, businessCode })
                    return data
                    },
                enabled:
                    (options?.enabled ?? true) &&
                    !!administrativeCode &&
                    !!businessCode,
                   staleTime: 1000 * 60 * 60 * 23,
                   gcTime: 1000 * 60 * 60 * 24,
                })

            return {
                ...context,
                }
            }

export default useSearchAnalysisReport