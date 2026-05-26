package com.kodong.underscore.map.entity;

import com.kodong.underscore.map.dto.IncomeConsumptionDTO;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class IncomeConsumption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "administrative_dong_id")
    private AdministrativeDistrict administrativeDistrict;

    private String standardYearQuarterCode; //기준 년·분기 코드
    private long monthlyAverageIncomeAmount;//월평균 소득 금액
    private String incomeSectionCode;//소득 구간 코드
    private long totalExpenditureAmount;//소비 지출 총액
    private long groceriesExpenditureAmount;//식료품 지출 금액
    private long clothesFootwearExpenditureAmount;//의류·신발 지출 금액
    private long leisureSpecialExpenditureAmount;//생활용품 지출 금액
    private long medicalCarePharmacyExpenditureAmount;//의료·약국 지출 금액
    private long transportExpenditureAmount;//교통·통신 지출 금액
    private long educationExpenditureAmount;//교육 지출 금액
    private long pleasureExpenditureAmount;//오락·여가 지출 금액
    private long leisureCultureExpenditureAmount;//여가·문화 지출 금액
    private long etcExpenditureAmount;//기타 지출 금액
    private long foodExpenditureAmount;//음식점(외식) 지출 금액


    @Builder
    public IncomeConsumption(AdministrativeDistrict dong, IncomeConsumptionDTO incomeConsumptionDTO){
        this.administrativeDistrict = dong;
        this.standardYearQuarterCode = incomeConsumptionDTO.getStandardYearQuarterCode();
        this.monthlyAverageIncomeAmount = incomeConsumptionDTO.getMonthlyAverageIncomeAmount();
        this.incomeSectionCode = incomeConsumptionDTO.getIncomeSectionCode();
        this.totalExpenditureAmount = incomeConsumptionDTO.getTotalExpenditureAmount();
        this.groceriesExpenditureAmount = incomeConsumptionDTO.getGroceriesExpenditureAmount();
        this.clothesFootwearExpenditureAmount = incomeConsumptionDTO.getClothesFootwearExpenditureAmount();
        this.leisureSpecialExpenditureAmount = incomeConsumptionDTO.getLeisureSpecialExpenditureAmount();
        this.medicalCarePharmacyExpenditureAmount = incomeConsumptionDTO.getMedicalCarePharmacyExpenditureAmount();
        this.transportExpenditureAmount = incomeConsumptionDTO.getTransportExpenditureAmount();
        this.educationExpenditureAmount = incomeConsumptionDTO.getEducationExpenditureAmount();
        this.pleasureExpenditureAmount = incomeConsumptionDTO.getPleasureExpenditureAmount();
        this.leisureCultureExpenditureAmount = incomeConsumptionDTO.getLeisureCultureExpenditureAmount();
        this.etcExpenditureAmount = incomeConsumptionDTO.getEtcExpenditureAmount();
        this.foodExpenditureAmount = incomeConsumptionDTO.getFoodExpenditureAmount();
    }
}
