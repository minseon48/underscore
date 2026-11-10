package com.kodong.underscore.checklist.dto;

import com.kodong.underscore.checklist.entity.Checklist;
import com.kodong.underscore.checklist.entity.ChecklistItem;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
public class ChecklistDetail {

    private Long id;
    private String title;
    private Long groupId;
    private String groupName;
    private String memo;
    private List<ChecklistItemResponse> items;
    private LocalDateTime createdAt;

    public static ChecklistDetail from(Checklist checklist, List<ChecklistItemResponse> checklistItems){
        return ChecklistDetail.builder()
                .id(checklist.getId())
                .title(checklist.getTitle())
                .groupId(checklist.getGroup().getId())
                .groupName(checklist.getGroup().getName())
                .memo(checklist.getMemo())
                .items(checklistItems)
                .createdAt(checklist.getCreatedAt())
                .build();
    }

}
