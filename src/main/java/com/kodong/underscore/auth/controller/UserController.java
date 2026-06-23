package com.kodong.underscore.auth.controller;

import com.kodong.underscore.auth.dto.CustomOAuth2User;
import com.kodong.underscore.auth.dto.UserInfoDTO;
import com.kodong.underscore.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    //user 정보 반환
    @GetMapping("/info")
    public UserInfoDTO getUserInfo(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        if(customOAuth2User == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증이 필요합니다.");
        }

        String username = customOAuth2User.getUsername();

        UserInfoDTO userInfo = userService.getUsers(username);

        return userInfo;

    }
}
