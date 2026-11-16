package com.kodong.underscore.support.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SupportListInfoResponse {
    private int count;
    private int totalCount;
    private List<SupportItemResponse> items;
}
