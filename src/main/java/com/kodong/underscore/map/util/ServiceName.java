package com.kodong.underscore.map.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ServiceName {

    // 유동인구
    FloatingPopulation("FloatingPopulationData.csv",
                               new String[]{
        "standardYearQuarterCode", "adstrdCode", "adstrdCodeName",
                "totFlpopCo", "mlFlpopCo", "fmlFlpopCo",
                "agrde10FlpopCo", "agrde20FlpopCo", "agrde30FlpopCo", "agrde40FlpopCo", "agrde50FlpopCo", "agrde60AboveFlpopCo",
                "tmzon0006FlpopCo", "tmzon0611FlpopCo", "tmzon1114FlpopCo",  "tmzon1417FlpopCo",  "tmzon1721FlpopCo", "tmzon2124FlpopCo",
                "monFlpopCo", "tuesFlpopCo", "wedFlpopCo", "thurFlpopCo", "friFlpopCo", "satFlpopCo", "sunFlpopCo"
    }),

    // 상주인구
    ResidentPopulation("ResidentPopulationData.csv",
                               new String[]{
        "standardYearQuarterCode", "adstrdCode", "adstrdCodeName",
                "totalRepopCount", "maleRepopCount", "femaleRepopCount",
                "age10RepopCount", "age20RepopCount", "age30RepopCount", "age40RepopCount", "age50RepopCount", "age60AboveRepopCount",
                "maleAge10RepopCount", "maleAge20RepopCount", "maleAge30RepopCount", "maleAge40RepopCount", "maleAge50RepopCount", "maleAge60AboveRepopCount",
                "femaleAge10RepopCount", "femaleAge20RepopCount", "femaleAge30RepopCount", "femaleAge40RepopCount", "femaleAge50RepopCount", "femaleAge60AboveRepopCount",
                "totalHouseholdCount", "apartmentHouseholdCount", "nonApartmentHouseholdCount"
    }),

    // 소득소비
    IncomeConsumption( "IncomeConsumptionData.csv",
                              new String[]{
        "standardYearQuarterCode", "adstrdCode", "adstrdCodeName",
                "monthlyAverageIncomeAmount", "incomeSectionCode",
                "totalExpenditureAmount", "groceriesExpenditureAmount", "clothesFootwearExpenditureAmount", "leisureSpecialExpenditureAmount",
                "medicalCarePharmacyExpenditureAmount", "transportExpenditureAmount", "educationExpenditureAmount",
                "pleasureExpenditureAmount", "leisureCultureExpenditureAmount", "etcExpenditureAmount", "foodExpenditureAmount"
    }),

    // 점포
    Store("StoresData.csv",
                  new String[]{
        "standardYearQuarterCode", "adstrdCode", "adstrdCodeName",
                "serviceIndustryCode", "serviceIndustryCodeName",
                "storeCount", "similarIndustryStoreCount",
                "openingBusinessRate", "openingBusinessStoreCount", "closingBusinessRate", "closingBusinessStoreCount",
                "franchiseStoreCount"
    }),

    // 추정 매출
    Selling("SellingData.csv",
                    new String[]{
        "standardYearQuarterCode", "adstrdCode", "adstrdCodeName",
                "serviceIndustryCode", "serviceIndustryCodeName",
                "thisMonthSellingAmt", "thisMonthSellingCount",
                "midweekSellingAmt", "weekendSellingAmt",
                "monSellingAmt", "tuesSellingAmt", "wedSellingAmt", "thurSellingAmt", "friSellingAmt", "satSellingAmt", "sunSellingAmt",
                "tmzon0006SellingAmt", "tmzon0611SellingAmt", "tmzon1114SellingAmt", "tmzon1417SellingAmt", "tmzon1721SellingAmt", "tmzon2124SellingAmt",
                "mlSellingAmt", "fmlSellingAmt",
                "ageGrade10SellingAmt", "ageGrade20SellingAmt", "ageGrade30SellingAmt", "ageGrade40SellingAmt", "ageGrade50SellingAmt", "ageGrade60AboveSellingAmt",
                "midweekSellingCount", "weekendSellingCount",
                "monSellingCount", "tuesSellingCount", "wedSellingCount", "thurSellingCount", "friSellingCount", "satSellingCount", "sunSellingCount",
                "tmzon0006SellingCount", "tmzon0611SellingCount", "tmzon1114SellingCount", "tmzon1417SellingCount", "tmzon1721SellingCount", "tmzon2124SellingCount",
                "mlSellingCount", "fmlSellingCount",
                "ageGrade10SellingCount", "ageGrade20SellingCount", "ageGrade30SellingCount", "ageGrade40SellingCount", "ageGrade50SellingCount", "ageGrade60AboveSellingCount"
    }),

    // 상권변화지표
    IndexQuarterlyQuotient( "IndexQuarterlyQuotientData.csv",
                                   new String[]{
        "standardYearQuarterCode", "adstrdCode", "adstrdCodeName",
                "tradeAreaChangeIndex", "tradeAreaChangeIndexName",
                "operatingSaleMonthAvg", "closeSaleMonthAvg", "seoulOperatingSaleMonthAvg", "seoulCloseSaleMonthAvg"
    });

    private final String csvFileName;
    private final String[] dataNames;
}
