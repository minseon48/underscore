package com.kodong.underscore.checklist.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class ChecklistOverview {
    private Long id;
    private String title;
    private String memo;
    private Long groupId;
    private String groupName;
    private int progressPercent;
    private List<ChecklistSectionCard> sections;
}
