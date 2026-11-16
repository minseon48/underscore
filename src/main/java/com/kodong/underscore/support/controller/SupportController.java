package com.kodong.underscore.support.controller;

import com.kodong.underscore.auth.dto.CustomOAuth2User;
import com.kodong.underscore.support.dto.SupportListInfoResponse;
import com.kodong.underscore.support.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/support")
public class SupportController {

    private final SupportService supportService;

    @GetMapping
    public SupportListInfoResponse getSupportInfo(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                                  @RequestParam(defaultValue = "1") int page,
                                                  @RequestParam(defaultValue = "10") int size,
                                                  @RequestParam(required = false) String startDate,
                                                  @RequestParam(required = false) String endDate,
                                                  @RequestParam(required = false) String region,
                                                  @RequestParam(required = false) String recruitmentStatus){

        if(customOAuth2User == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        return supportService.getSupport(page,size,startDate,endDate,region,recruitmentStatus);

    }
}
