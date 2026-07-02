package com.kodong.underscore.auth.service;

import com.kodong.underscore.auth.dto.UserInfoDTO;
import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.auth.repository.UserRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserInfoDTO getUsers(String username){
        User users = userRepository.findByUsername(username);

        String name = users.getName();
        String email = users.getEmail();


        UserInfoDTO userInfo = UserInfoDTO.builder()
                .name(name)
                .email(email)
                .build();


        return userInfo;

    }
}
