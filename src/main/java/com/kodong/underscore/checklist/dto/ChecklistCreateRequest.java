package com.kodong.underscore.checklist.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class ChecklistCreateRequest {
    private Long groupId;
    private String title;
    private String memo;
    private List<ChecklistItemBulkRequest> items;
}
