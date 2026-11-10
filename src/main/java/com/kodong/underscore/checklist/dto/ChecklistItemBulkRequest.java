package com.kodong.underscore.checklist.dto;

import lombok.Getter;

@Getter
public class ChecklistItemBulkRequest {
    private String clientId;
    private String parentClientId;
    private String title;
    private String memo;
    private int sortOrder;
}
