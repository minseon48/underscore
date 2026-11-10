package com.kodong.underscore.checklist.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SectionDetail {
    private ChecklistSectionCard section;
    private List<ChecklistItemResponse> items;
}
