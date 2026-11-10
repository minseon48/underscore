package com.kodong.underscore.checklist.dto;

import java.util.List;
import lombok.Getter;

@Getter
public class SectionItemReplaceRequest {
    private List<ChecklistItemBulkRequest> items;
}
