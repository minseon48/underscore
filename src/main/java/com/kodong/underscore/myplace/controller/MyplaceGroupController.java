package com.kodong.underscore.myplace.controller;

import com.kodong.underscore.auth.dto.CustomOAuth2User;
import com.kodong.underscore.myplace.dto.MyplaceGroupResponse;
import com.kodong.underscore.myplace.service.MyplaceGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/myplace/groups")
public class MyplaceGroupController {

    private final MyplaceGroupService myplaceGroupService;

    @GetMapping
    public List<MyplaceGroupResponse> getGroups(@AuthenticationPrincipal CustomOAuth2User user){

        if(user == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"로그인이 필요합니다.");
        }

        return myplaceGroupService.getGroups(user.getUsername());

    }


    @PostMapping
    public MyplaceGroupResponse createGroup(@AuthenticationPrincipal CustomOAuth2User user,
                                            @RequestBody Map<String, String> request) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return myplaceGroupService.createGroup(user.getUsername(), request.get("name"));
    }

    @DeleteMapping("/{groupId}")
    public void deleteGroup(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                            @PathVariable Long groupId){

        if(customOAuth2User == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        myplaceGroupService.deleteGroup(customOAuth2User.getUsername(),groupId);
    }
}
