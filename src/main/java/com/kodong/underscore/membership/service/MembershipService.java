package com.kodong.underscore.membership.service;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.auth.repository.UserRepository;
import com.kodong.underscore.membership.SubscriptionCode;
import com.kodong.underscore.membership.dto.MembershipResponse;
import com.kodong.underscore.membership.entity.MembershipPlan;
import com.kodong.underscore.membership.entity.UserMembership;
import com.kodong.underscore.membership.repository.MembershipPlanRepository;
import com.kodong.underscore.membership.repository.UserMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MembershipService {

    private final UserRepository userRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final UserMembershipRepository userMembershipRepository;


    @Transactional
    public MembershipResponse getMembership(String username){
        User user = userRepository.findByUsername(username);

        if(user == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        UserMembership userMembership = userMembershipRepository.findByUser(user)
                .orElseGet(() -> createFreeMembership(user));


        return toResponse(userMembership);
    }

    private MembershipResponse toResponse(UserMembership userMembership) {
        SubscriptionCode code = userMembership.getCurrentPlan().getMembershipCode();
        return MembershipResponse.builder()
                .isSubscribed(code != SubscriptionCode.FREE)
                .subscriptionCode(code.getValue())
                .startedAt(userMembership.getStartedAt())
                .expiredAt(userMembership.getExpiredAt())
                .build();
    }

    @Transactional
    private UserMembership createFreeMembership(User user) {
        MembershipPlan freePlan = membershipPlanRepository.findByMembershipCode(SubscriptionCode.FREE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "무료 멤버십이 없습니다."));


        UserMembership membership = UserMembership.createFree(user, freePlan);

        return userMembershipRepository.save(membership);

    }
}
