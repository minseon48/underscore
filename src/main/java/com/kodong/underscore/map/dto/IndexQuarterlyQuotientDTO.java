package com.kodong.underscore.map.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kodong.underscore.map.entity.AdministrativeDistrict;
import com.kodong.underscore.map.entity.IndexQuarterlyQuotient;
import lombok.Data;

@Data
public class IndexQuarterlyQuotientDTO {
    @JsonProperty("STDR_YYQU_CD")
    private String standardYearQuarterCode;//기준 년·분기 코드

    @JsonProperty("ADSTRD_CD")
    private String adstrdCode;//행정동 코드

    @JsonProperty("ADSTRD_CD_NM")
    private String adstrdCodeName;//행정동 코드 이름

    @JsonProperty("TRDAR_CHNGE_IX")
    private String tradeAreaChangeIndex;//상권 변화 지표

    @JsonProperty("TRDAR_CHNGE_IX_NM")
    private String tradeAreaChangeIndexName;//상권 변화 지표 명칭

    @JsonProperty("OPR_SALE_MT_AVRG")
    private int operatingSaleMonthAvg;//운영·개업 평균

    @JsonProperty("CLS_SALE_MT_AVRG")
    private int closeSaleMonthAvg;//폐업 평균

    @JsonProperty("SU_OPR_SALE_MT_AVRG")
    private int seoulOperatingSaleMonthAvg;//서울 폐업 영업 개월 평균

    @JsonProperty("SU_CLS_SALE_MT_AVRG")
    private int seoulCloseSaleMonthAvg;

    public IndexQuarterlyQuotient convertToIndxQuarterlyQuotient(AdministrativeDistrict dong, IndexQuarterlyQuotientDTO ixqq){
        return IndexQuarterlyQuotient.builder()
                .dong(dong)
                .indexQ(ixqq)
                .build();
    }
}
