package com.kodong.underscore.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class UserInfoDTO {
    private String name;
    private String email;
}
