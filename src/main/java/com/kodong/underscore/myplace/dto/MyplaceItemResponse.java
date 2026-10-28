package com.kodong.underscore.myplace.dto;

import com.kodong.underscore.myplace.entity.Myplace;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyplaceItemResponse {
    private Long id;
    private String addressName;
    private String memo;
    private Coordinates coordinates;

    @Getter
    @Builder
    public static class Coordinates {
        private double latitude;
        private double longitude;
    }

    public static MyplaceItemResponse from(Myplace myplace){
        return MyplaceItemResponse.builder()
                .id(myplace.getId())
                .addressName(myplace.getAddressName())
                .memo(myplace.getMemo())
                .coordinates(Coordinates.builder()
                        .latitude(myplace.getLatitude())
                        .longitude(myplace.getLongitude())
                        .build())
                .build();
    }
}
