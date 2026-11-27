package com.kodong.underscore.membership.controller;

import com.kodong.underscore.auth.dto.CustomOAuth2User;
import com.kodong.underscore.membership.dto.MembershipResponse;
import com.kodong.underscore.membership.service.MembershipService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    private final MembershipService membershipService;


    @GetMapping
    public MembershipResponse getMembership(@AuthenticationPrincipal CustomOAuth2User user){
        if(user == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"로그인이 필요합니다.");
        }

        return membershipService.getMembership(user.getUsername());
    }
}
