package com.kodong.underscore.map.dto;

import com.kodong.underscore.map.entity.AdministrativeDistrict;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdministrativeDistrictSearchResponse {
    private String administrativeCode;
    private String addressName;
    private Coordinates coordinates;


    @Getter
    @Builder
    public static class Coordinates{
        private double latitude;
        private double longitude;
    }

    public static AdministrativeDistrictSearchResponse from(AdministrativeDistrict district){
        return AdministrativeDistrictSearchResponse.builder()
                .administrativeCode(district.getAdministrativeCode())
                .addressName(district.getFullAddress())
                .coordinates(Coordinates.builder()
                        .latitude(district.getYLatitude())
                        .longitude(district.getXLongitude())
                        .build())
                .build();
    }
}
