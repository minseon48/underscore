package com.kodong.underscore.checklist.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChecklistSectionCard {
    private Long id;
    private String title;
    private int sortOrder;
    private int totalTaskCount;
    private int checkedTaskCount;
    private int progressPercent;
}
