package com.kodong.underscore.map.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kodong.underscore.map.entity.AdministrativeDistrict;
import com.kodong.underscore.map.entity.Selling;
import com.kodong.underscore.map.entity.ServiceIndustry;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SellingDTO {
    @JsonProperty("STDR_YYQU_CD")
    private String standardYearQuarterCode;

    @JsonProperty("ADSTRD_CD")
    private String adstrdCode;

    @JsonProperty("ADSTRD_CD_NM")
    private String adstrdCodeName;

    @JsonProperty("SVC_INDUTY_CD")
    private String serviceIndustryCode;

    @JsonProperty("SVC_INDUTY_CD_NM")
    private String serviceIndustryCodeName;

    @JsonProperty("THSMON_SELNG_AMT")
    private BigDecimal thisMonthSellingAmt;

    @JsonProperty("THSMON_SELNG_CO")
    private long thisMonthSellingCount;

    @JsonProperty("MDWK_SELNG_AMT")
    private BigDecimal midweekSellingAmt;

    @JsonProperty("WKEND_SELNG_AMT")
    private BigDecimal weekendSellingAmt;

    @JsonProperty("MON_SELNG_AMT")
    private BigDecimal monSellingAmt;

    @JsonProperty("TUES_SELNG_AMT")
    private BigDecimal tuesSellingAmt;

    @JsonProperty("WED_SELNG_AMT")
    private BigDecimal wedSellingAmt;

    @JsonProperty("THUR_SELNG_AMT")
    private BigDecimal thurSellingAmt;

    @JsonProperty("FRI_SELNG_AMT")
    private BigDecimal friSellingAmt;

    @JsonProperty("SAT_SELNG_AMT")
    private BigDecimal satSellingAmt;

    @JsonProperty("SUN_SELNG_AMT")
    private BigDecimal sunSellingAmt;

    @JsonProperty("TMZON_00_06_SELNG_AMT")
    private BigDecimal tmzon0006SellingAmt;

    @JsonProperty("TMZON_06_11_SELNG_AMT")
    private BigDecimal tmzon0611SellingAmt;

    @JsonProperty("TMZON_11_14_SELNG_AMT")
    private BigDecimal tmzon1114SellingAmt;

    @JsonProperty("TMZON_14_17_SELNG_AMT")
    private BigDecimal tmzon1417SellingAmt;

    @JsonProperty("TMZON_17_21_SELNG_AMT")
    private BigDecimal tmzon1721SellingAmt;

    @JsonProperty("TMZON_21_24_SELNG_AMT")
    private BigDecimal tmzon2124SellingAmt;

    @JsonProperty("ML_SELNG_AMT")
    private BigDecimal mlSellingAmt;

    @JsonProperty("FML_SELNG_AMT")
    private BigDecimal fmlSellingAmt;

    @JsonProperty("AGRDE_10_SELNG_AMT")
    private BigDecimal ageGrade10SellingAmt;

    @JsonProperty("AGRDE_20_SELNG_AMT")
    private BigDecimal ageGrade20SellingAmt;

    @JsonProperty("AGRDE_30_SELNG_AMT")
    private BigDecimal ageGrade30SellingAmt;

    @JsonProperty("AGRDE_40_SELNG_AMT")
    private BigDecimal ageGrade40SellingAmt;

    @JsonProperty("AGRDE_50_SELNG_AMT")
    private BigDecimal ageGrade50SellingAmt;

    @JsonProperty("AGRDE_60_ABOVE_SELNG_AMT")
    private BigDecimal ageGrade60AboveSellingAmt;

    @JsonProperty("MDWK_SELNG_CO")
    private long midweekSellingCount;

    @JsonProperty("WKEND_SELNG_CO")
    private long weekendSellingCount;

    @JsonProperty("MON_SELNG_CO")
    private long monSellingCount;

    @JsonProperty("TUES_SELNG_CO")
    private long tuesSellingCount;

    @JsonProperty("WED_SELNG_CO")
    private long wedSellingCount;

    @JsonProperty("THUR_SELNG_CO")
    private long thurSellingCount;

    @JsonProperty("FRI_SELNG_CO")
    private long friSellingCount;

    @JsonProperty("SAT_SELNG_CO")
    private long satSellingCount;

    @JsonProperty("SUN_SELNG_CO")
    private long sunSellingCount;

    @JsonProperty("TMZON_00_06_SELNG_CO")
    private long tmzon0006SellingCount;

    @JsonProperty("TMZON_06_11_SELNG_CO")
    private long tmzon0611SellingCount;

    @JsonProperty("TMZON_11_14_SELNG_CO")
    private long tmzon1114SellingCount;

    @JsonProperty("TMZON_14_17_SELNG_CO")
    private long tmzon1417SellingCount;

    @JsonProperty("TMZON_17_21_SELNG_CO")
    private long tmzon1721SellingCount;

    @JsonProperty("TMZON_21_24_SELNG_CO")
    private long tmzon2124SellingCount;

    @JsonProperty("ML_SELNG_CO")
    private long mlSellingCount;

    @JsonProperty("FML_SELNG_CO")
    private long fmlSellingCount;

    @JsonProperty("AGRDE_10_SELNG_CO")
    private long ageGrade10SellingCount;

    @JsonProperty("AGRDE_20_SELNG_CO")
    private long ageGrade20SellingCount;

    @JsonProperty("AGRDE_30_SELNG_CO")
    private long ageGrade30SellingCount;

    @JsonProperty("AGRDE_40_SELNG_CO")
    private long ageGrade40SellingCount;

    @JsonProperty("AGRDE_50_SELNG_CO")
    private long ageGrade50SellingCount;

    @JsonProperty("AGRDE_60_ABOVE_SELNG_CO")
    private long ageGrade60AboveSellingCount;

    public Selling convertToSelling(AdministrativeDistrict dong, ServiceIndustry industry, SellingDTO sellingDTO){
        return Selling.builder()
                .dong(dong)
                .serviceIndustry(industry)
                .sellingDTO(sellingDTO)
                .build();
    }
}
