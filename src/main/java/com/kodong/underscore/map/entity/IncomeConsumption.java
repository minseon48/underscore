package com.kodong.underscore.map.entity;

import com.kodong.underscore.map.dto.IncomeConsumptionDTO;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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

    private String standardYearQuarterCode;
    private BigDecimal monthlyAverageIncomeAmount;
    private String incomeSectionCode;
    private BigDecimal totalExpenditureAmount;
    private BigDecimal groceriesExpenditureAmount;
    private BigDecimal clothesFootwearExpenditureAmount;
    private BigDecimal leisureSpecialExpenditureAmount;
    private BigDecimal medicalCarePharmacyExpenditureAmount;
    private BigDecimal transportExpenditureAmount;
    private BigDecimal educationExpenditureAmount;
    private BigDecimal pleasureExpenditureAmount;
    private BigDecimal leisureCultureExpenditureAmount;
    private BigDecimal etcExpenditureAmount;
    private BigDecimal foodExpenditureAmount;


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
