package com.kodong.underscore.checklist.dto;

import com.kodong.underscore.checklist.entity.Checklist;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ChecklistResponse {
    private Long id;
    private String title;
    private Long groupId;
    private String groupName;

    public static ChecklistResponse from(Checklist checklist){
        return ChecklistResponse.builder()
                .id(checklist.getId())
                .title(checklist.getTitle())
                .groupId(checklist.getGroup().getId())
                .groupName(checklist.getGroup().getName())
                .build();

    }
}
