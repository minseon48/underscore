package com.kodong.underscore.checklist.dto;

import com.kodong.underscore.checklist.entity.ChecklistItem;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChecklistItemResponse {
    private Long id;
    private Long parentId;
    private String title;
    private String memo;
    private boolean checked;
    private int sortOrder;

    public static ChecklistItemResponse from(ChecklistItem item){
        return ChecklistItemResponse.builder()
                .id(item.getId())
                .parentId(item.getParent() != null ? item.getParent().getId() : null)
                .title(item.getTitle())
                .memo(item.getMemo())
                .checked(item.isChecked())
                .sortOrder(item.getSortOrder())
                .build();
    }
}
