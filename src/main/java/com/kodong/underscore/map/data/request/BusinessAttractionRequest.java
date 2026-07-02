package com.kodong.underscore.map.data.request;

import lombok.Builder;
import lombok.Data;

/*클라이언트에서 개업 매력도 점수 요청 시 Body와 매핑되는 클래스*/
@Data
@Builder
public class BusinessAttractionRequest {
    private Long administrativeDistrictId;

    private double minXLongitude;

    private double maxXLongitude;

    private double minYLatitude;

    private double maxYLatitude;

    private String serviceIndustryCode;
}
