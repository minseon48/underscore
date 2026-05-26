package com.kodong.underscore.map.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class BusinessAttractionDTO {
    private Long id;
    private String administrativeDistrictName; //행정동 이름
    private int[] businessAttractionScores; // 개업매력도 분야별 점수
    private int totalScore; //총 점
    private double xLongitude;
    private double yLatitude;
}
