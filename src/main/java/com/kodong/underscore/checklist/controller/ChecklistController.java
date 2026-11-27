package com.kodong.underscore.checklist.controller;

import com.kodong.underscore.auth.dto.CustomOAuth2User;
import com.kodong.underscore.checklist.dto.*;
import com.kodong.underscore.checklist.service.ChecklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/checklists")
public class ChecklistController {

    private final ChecklistService checklistService;

    @GetMapping
    public List<ChecklistResponse> getChecklists(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        if (customOAuth2User == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return checklistService.getChecklists(customOAuth2User.getUsername());
    }

    @PostMapping
    public ChecklistOverview createChecklist(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @RequestBody ChecklistCreateRequest request) {

        if (customOAuth2User == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return checklistService.createChecklist(customOAuth2User.getUsername(), request);
    }

    @GetMapping("/{checklistId}")
    public ChecklistOverview getChecklistOverview(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long checklistId) {

        if (customOAuth2User == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return checklistService.getChecklistOverview(customOAuth2User.getUsername(), checklistId);
    }


    @DeleteMapping("/{checklistId}")
    public void deleteChecklist(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long checklistId){
        if(customOAuth2User == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"로그인이 필요합니다.");
        }

        checklistService.deleteChecklist(customOAuth2User.getUsername(), checklistId);
    }


    @GetMapping("/{checklistId}/sections/{sectionId}")
    public SectionDetail getSectionDetail(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long checklistId,
            @PathVariable Long sectionId) {

        if (customOAuth2User == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return checklistService.getSectionDetail(
                customOAuth2User.getUsername(), checklistId, sectionId);
    }

    @PostMapping("/{checklistId}/sections")
    public ChecklistSectionCard createSection(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long checklistId,
            @RequestBody SectionCreateRequest request) {

        if (customOAuth2User == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return checklistService.createSection(
                customOAuth2User.getUsername(), checklistId, request);
    }

    @PutMapping("/{checklistId}/sections/{sectionId}/items")
    public SectionDetail replaceSectionItems(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long checklistId,
            @PathVariable Long sectionId,
            @RequestBody SectionItemReplaceRequest request) {

        if (customOAuth2User == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return checklistService.replaceSectionItems(
                customOAuth2User.getUsername(), checklistId, sectionId, request);
    }

    @PostMapping("/{checklistId}/item")
    public ChecklistItemResponse createChecklistItem(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long checklistId,
            @RequestBody ChecklistItemCreateRequest request) {

        if (customOAuth2User == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return checklistService.createChecklistItem(
                customOAuth2User.getUsername(), checklistId, request);
    }

    @PatchMapping("/{checklistId}/items/{itemId}")
    public ChecklistItemResponse updateChecklistItem(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long checklistId,
            @PathVariable Long itemId,
            @RequestBody ChecklistItemUpdateRequest updateRequest) {

        if (customOAuth2User == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return checklistService.updateChecklistItem(
                customOAuth2User.getUsername(), checklistId, itemId, updateRequest);
    }
}
