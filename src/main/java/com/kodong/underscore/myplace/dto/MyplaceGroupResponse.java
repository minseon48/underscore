package com.kodong.underscore.myplace.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kodong.underscore.myplace.entity.MyplaceGroup;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyplaceGroupResponse {
    private Long id;
    private String name;
    @JsonProperty("isDefault")
    private boolean isDefault;
    private int placeCount;
    private int maxCount;

    public static MyplaceGroupResponse from(MyplaceGroup group, int placeCount){
        return MyplaceGroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .isDefault(group.isDefaultGroup())
                .placeCount(placeCount)
                .maxCount(100)
                .build();
    }
}
