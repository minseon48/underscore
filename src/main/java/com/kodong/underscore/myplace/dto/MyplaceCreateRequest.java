package com.kodong.underscore.myplace.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class MyplaceCreateRequest {
    @JsonProperty("id")
    private String administrativeCode;
    private String addressName;//행정동명
    private Long groupId;
    private Coordinates coordinates;
    private String memo;


    @NoArgsConstructor
    @Getter
    public static class Coordinates{
        private Double latitude;
        private Double longitude;
    }
}
