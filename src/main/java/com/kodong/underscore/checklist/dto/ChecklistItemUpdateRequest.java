package com.kodong.underscore.checklist.dto;

import lombok.Getter;

@Getter
public class ChecklistItemUpdateRequest {
    private Boolean checked;//null이면 변경x
    private String memo;
}
