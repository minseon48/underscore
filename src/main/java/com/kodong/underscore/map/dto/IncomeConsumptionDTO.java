package com.kodong.underscore.map.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kodong.underscore.map.entity.AdministrativeDistrict;
import com.kodong.underscore.map.entity.IncomeConsumption;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class IncomeConsumptionDTO {
    @JsonProperty("STDR_YYQU_CD")
    private String standardYearQuarterCode;

    @JsonProperty("ADSTRD_CD")
    private String adstrdCode;

    @JsonProperty("ADSTRD_CD_NM")
    private String adstrdCodeName;

    @JsonProperty("INCOME_SCTN_CD")
    private String incomeSectionCode;

    @JsonProperty("EXPNDTR_TOTAMT")
    private BigDecimal totalExpenditureAmount;

    @JsonProperty("GC_EXPNDTR_TOTAMT")
    private BigDecimal groceriesExpenditureAmount;

    @JsonProperty("CLTHS_FTWR_EXPNDTR_TOTAMT")
    private BigDecimal clothesFootwearExpenditureAmount;

    @JsonProperty("LVSPL_EXPNDTR_TOTAMT")
    private BigDecimal leisureSpecialExpenditureAmount;

    @JsonProperty("MCP_EXPNDTR_TOTAMT")
    private BigDecimal medicalCarePharmacyExpenditureAmount;

    @JsonProperty("TRNSPORT_EXPNDTR_TOTAMT")
    private BigDecimal transportExpenditureAmount;

    @JsonProperty("EDC_EXPNDTR_TOTAMT")
    private BigDecimal educationExpenditureAmount;

    @JsonProperty("PLESR_EXPNDTR_TOTAMT")
    private BigDecimal pleasureExpenditureAmount;

    @JsonProperty("LSR_CLTUR_EXPNDTR_TOTAMT")
    private BigDecimal leisureCultureExpenditureAmount;

    @JsonProperty("ETC_EXPNDTR_TOTAMT")
    private BigDecimal etcExpenditureAmount;

    @JsonProperty("FD_EXPNDTR_TOTAMT")
    private BigDecimal foodExpenditureAmount;


    public IncomeConsumption convertToIncomeConsumption(AdministrativeDistrict dong, IncomeConsumptionDTO incomeConsumptionDTO){
        return IncomeConsumption.builder()
                .dong(dong)
                .incomeConsumptionDTO(incomeConsumptionDTO)
                .build();
    }
}
