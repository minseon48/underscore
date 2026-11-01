package com.kodong.underscore.membership.service;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.auth.repository.UserRepository;
import com.kodong.underscore.membership.SubscriptionCode;
import com.kodong.underscore.membership.dto.MembershipResponse;
import com.kodong.underscore.membership.entity.MembershipPlan;
import com.kodong.underscore.membership.entity.UserMembership;
import com.kodong.underscore.membership.repository.MembershipPlanRepository;
import com.kodong.underscore.membership.repository.UserMembershipRepository;
import com.kodong.underscore.payment.PaymentState;
import com.kodong.underscore.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class MembershipService {

    private final UserRepository userRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final PaymentRepository paymentRepository;

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    @Transactional
    public MembershipResponse getMembership(String username) {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        UserMembership userMembership = userMembershipRepository.findByUser(user)
                .orElseGet(() -> createFreeMembership(user));

        return toResponse(userMembership);
    }

    private MembershipResponse toResponse(UserMembership userMembership) {
        SubscriptionCode code = userMembership.getCurrentPlan().getMembershipCode();
        LocalDateTime expiredAt = userMembership.getExpiredAt();

        Integer daysUntilExpiration = null;
        boolean showRenewalNotice = false;

        if(code != SubscriptionCode.FREE && expiredAt != null){
            LocalDate today = LocalDate.now();
            LocalDate expiredDate = expiredAt.toLocalDate();

            long days = ChronoUnit.DAYS.between(today,expiredDate);

            daysUntilExpiration = (int) days;
            showRenewalNotice = days >= 0 && days <= 3;
        }


        MembershipResponse.MembershipResponseBuilder builder = MembershipResponse.builder()
                .isSubscribed(code != SubscriptionCode.FREE)
                .subscriptionCode(code.getValue())
                .startedAt(userMembership.getStartedAt())
                .expiredAt(expiredAt)
                .daysUntilExpiration(daysUntilExpiration)
                .showRenewalNotice(showRenewalNotice);

        if (code != SubscriptionCode.FREE) {
            paymentRepository
                    .findFirstByUserAndPaymentStateOrderByIdDesc(
                            userMembership.getUser(),
                            PaymentState.DONE)
                    .ifPresent(payment -> {
                        Integer amount = payment.getPaymentAmount() != null
                                ? payment.getPaymentAmount().intValue()
                                : null;

                        builder.paymentMethod(payment.getPaymentMethod())
                                .paymentInfo(payment.getPaymentInfo())
                                .paymentAmount(amount)
                                .refundAmount(amount);
                    });
        }

        return builder.build();
    }

    @Transactional
    private UserMembership createFreeMembership(User user) {
        MembershipPlan freePlan = membershipPlanRepository.findByMembershipCode(SubscriptionCode.FREE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "무료 멤버십이 없습니다."));

        UserMembership membership = UserMembership.createFree(user, freePlan);

        return userMembershipRepository.save(membership);
    }


    @Transactional
    public int convertExpiredMembershipsToFree() {
        LocalDateTime todayStart = LocalDate.now(KST).atStartOfDay();//오늘 기준

        MembershipPlan freePlan = membershipPlanRepository
                .findByMembershipCode(SubscriptionCode.FREE)
                .orElseThrow(()-> new IllegalStateException("무료 멤버십이 없습니다."));

        List<UserMembership> expiredList = userMembershipRepository
                .findExpiredPaidMemberships(SubscriptionCode.FREE,todayStart);

        for(UserMembership membership : expiredList){
            membership.toFree(freePlan);
        }

        userMembershipRepository.saveAll(expiredList);
        log.info("만료 멤버십 무료 전환 완료 : {}건 (기준시각={})", expiredList.size(), todayStart);
        return expiredList.size();
    }
}
