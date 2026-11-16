package com.kodong.underscore.support.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class KstartupAnnouncementListResponse {
    private int currentCount;
    private List<KstartupAnnouncementResponse> data;
    private int matchCount;
    private int page;
    private int perPage;
    private int totalCount;
}
