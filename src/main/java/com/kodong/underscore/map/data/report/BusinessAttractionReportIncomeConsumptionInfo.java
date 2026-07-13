package com.kodong.underscore.map.data.report;

import com.kodong.underscore.map.entity.IncomeConsumption;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BusinessAttractionReportIncomeConsumptionInfo {
    private BigDecimal foodExpenditureAmount;

    @Builder
    public BusinessAttractionReportIncomeConsumptionInfo(IncomeConsumption incomeConsumption) {
        this.foodExpenditureAmount = incomeConsumption.getFoodExpenditureAmount();
    }
}
