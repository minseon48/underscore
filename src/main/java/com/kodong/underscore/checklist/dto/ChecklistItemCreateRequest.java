package com.kodong.underscore.checklist.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class ChecklistItemCreateRequest {
    private String title;
    private String memo;
    private Long parentId;
    private List<ChecklistItemBulkRequest> items;
}
