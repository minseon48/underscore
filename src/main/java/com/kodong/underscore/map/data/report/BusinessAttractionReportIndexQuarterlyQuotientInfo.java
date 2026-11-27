package com.kodong.underscore.map.data.report;

import com.kodong.underscore.map.entity.IndexQuarterlyQuotient;
import lombok.Builder;
import lombok.Data;

@Data
public class BusinessAttractionReportIndexQuarterlyQuotientInfo {
    private String tradeAreaChangeIndex;
    private String tradeAreaChangeIndexName;
    private int operatingBusinessMonthAverage;
    private int closedBusinessMonthAverage;
    private int seoulOperatingBusinessMonthAverage;
    private int seoulClosedBusinessMonthAverage;

    @Builder
    public BusinessAttractionReportIndexQuarterlyQuotientInfo(IndexQuarterlyQuotient indexQuarterlyQuotient) {
        this.tradeAreaChangeIndex = indexQuarterlyQuotient.getTradeAreaChangeIndex();
        this.tradeAreaChangeIndexName = indexQuarterlyQuotient.getTradeAreaChangeIndexName();
        this.operatingBusinessMonthAverage = indexQuarterlyQuotient.getOperatingSaleMonthAvg();
        this.closedBusinessMonthAverage = indexQuarterlyQuotient.getCloseSaleMonthAvg();
        this.seoulOperatingBusinessMonthAverage = indexQuarterlyQuotient.getSeoulOperatingSaleMonthAvg();
        this.seoulClosedBusinessMonthAverage = indexQuarterlyQuotient.getSeoulCloseSaleMonthAvg();
    }
}
