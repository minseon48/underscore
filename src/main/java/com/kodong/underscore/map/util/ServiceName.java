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
                "totalExpenditureAmount", "foodStaffsExpenditureAmount", "clothesFootwearExpenditureAmount", "leisureSpecialExpenditureAmount",
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
                "thsmonSelngAmt", "thsmonSelngCo",
                "mdwkSelngAmt", "wkendSelngAmt",
                "monSelngAmt", "tuesSelngAmt", "wedSelngAmt", "thurSelngAmt", "friSelngAmt", "satSelngAmt", "sunSelngAmt",
                "tmzon0006SelngAmt", "tmzon0611SelngAmt", "tmzon1114SelngAmt", "tmzon1417SelngAmt", "tmzon1721SelngAmt", "tmzon2124SelngAmt",
                "mlSelngAmt", "fmlSelngAmt",
                "agrde10SelngAmt", "agrde20SelngAmt", "agrde30SelngAmt", "agrde40SelngAmt", "agrde50SelngAmt", "agrde60AboveSelngAmt",
                "mdwkSelngCo", "wkendSelngCo",
                "monSelngCo", "tuesSelngCo", "wedSelngCo", "thurSelngCo", "friSelngCo", "satSelngCo", "sunSelngCo",
                "tmzon0006SelngCo", "tmzon0611SelngCo", "tmzon1114SelngCo", "tmzon1417SelngCo", "tmzon1721SelngCo", "tmzon2124SelngCo",
                "mlSelngCo", "fmlSelngCo",
                "agrde10SelngCo", "agrde20SelngCo", "agrde30SelngCo", "agrde40SelngCo", "agrde50SelngCo", "agrde60AboveSelngCo"
    }),

    // 상권변화지표
    IndexQuarterlyQuotient( "IndexQuarterlyQuotientData.csv",
                                   new String[]{
        "standardYearQuarterCode", "adstrdCode", "adstrdCodeName",
                "trdarChngeIx", "trdarChngeIxNm",
                "oprSaleMtAvrg", "clsSaleMtAvrg", "suOprSaleMtAvrg", "suClsSaleMtAvrg"
    });

    private final String csvFileName;
    private final String[] dataNames;
}
