package com.kodong.underscore.myplace.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MyplaceListResponse {
    private int count;
    private Long totalCount;
    private List<MyplaceItemResponse> items;
}
