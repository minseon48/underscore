package com.kodong.underscore.myplace.controller;

import com.kodong.underscore.auth.dto.CustomOAuth2User;
import com.kodong.underscore.map.dto.AdministrativeDistrictSearchResponse;
import com.kodong.underscore.myplace.dto.MyplaceItemResponse;
import com.kodong.underscore.myplace.dto.MyplaceListResponse;
import com.kodong.underscore.myplace.dto.MyplaceCreateRequest;
import com.kodong.underscore.myplace.service.MyplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/myplace")
public class MyplaceController {
    private final MyplaceService myplaceService;

    @GetMapping
    public MyplaceListResponse getPlaces(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                         @RequestParam Long groupId,
                                         @RequestParam(defaultValue = "1") int page,
                                         @RequestParam(defaultValue = "10") int size){

        if(customOAuth2User == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        return myplaceService.getPlaces(customOAuth2User.getUsername(),groupId,page,size);


    }

    @PostMapping
    public MyplaceItemResponse createPlaces(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                            @RequestBody MyplaceCreateRequest createRequest){
        if(customOAuth2User == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"로그인이 필요합니다.");
        }

        return myplaceService.createPlaces(customOAuth2User.getUsername(),createRequest);
    }

    @GetMapping("/administrative-districts")
    public List<AdministrativeDistrictSearchResponse> searchAdministrativeDistricts(
                                                                @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                                                @RequestParam String keyword){
        if(customOAuth2User == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"로그인이 필요합니다.");
        }

        return myplaceService.searchAdministrativeDistricts(keyword);
    }

    @DeleteMapping("/{myplaceId}")
    public void deleteMyplace(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long myplaceId){

        if(customOAuth2User == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        myplaceService.deleteMyplace(customOAuth2User.getUsername(),myplaceId);
    }
}
