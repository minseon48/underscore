package com.kodong.underscore.map.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class BusinessAttractionDTO {
    private String administrativeCode;
    private String administrativeDistrictName; //행정동 이름
    private int[] businessAttractionScores; // 개업매력도 분야별 점수
    private int totalScore; //총 점
    private Coordinates coordinates;


    @Data @Builder
    public static class Coordinates{
        private double longitude;
        private double latitude;
    }

}
