package com.kodong.underscore.payment.service;

import com.kodong.underscore.auth.dto.CustomOAuth2User;
import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.auth.repository.UserRepository;
import com.kodong.underscore.membership.SubscriptionCode;
import com.kodong.underscore.membership.entity.MembershipPlan;
import com.kodong.underscore.membership.entity.UserMembership;
import com.kodong.underscore.membership.repository.MembershipPlanRepository;
import com.kodong.underscore.membership.repository.UserMembershipRepository;
import com.kodong.underscore.payment.PaymentState;
import com.kodong.underscore.payment.dto.*;
import com.kodong.underscore.payment.entity.Payment;
import com.kodong.underscore.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.*;

@RequiredArgsConstructor
@Service
public class PaymentService {

    private final MembershipPlanRepository membershipPlanRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final UserMembershipRepository userMembershipRepository;

    @Value("${toss.secret-key}")
    private String tossSecretKey;

    public PaymentResponse createPaymentOrder(CustomOAuth2User oauthUser, String subscriptionCode) {
        SubscriptionCode code = SubscriptionCode.fromValue(subscriptionCode);

        if (code == SubscriptionCode.FREE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유료 이용권만 구매할 수 있습니다.");
        }

        MembershipPlan membershipPlan = membershipPlanRepository.findByMembershipCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "이용권 정보를 찾을 수 없습니다."));

        User user = userRepository.findByUsername(oauthUser.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        String customerKey = "user-" + user.getId();
        String orderId = UUID.randomUUID().toString();

        Payment payment = new Payment();

        payment.setUser(user);
        payment.setMembershipPlan(membershipPlan);
        payment.setOrderId(orderId);
        payment.setPaymentAmount((long) membershipPlan.getPrice());
        payment.setPaymentState(PaymentState.READY);

        paymentRepository.save(payment);

        return PaymentResponse.builder()
                .customerKey(customerKey)
                .orderId(orderId)
                .orderName(membershipPlan.getMembershipName())
                .amount(membershipPlan.getPrice())
                .build();
    }


    @Transactional
    public Long ConfirmRequestTossPayments(CustomOAuth2User oauthUser, String paymentKey, String orderId, Long amount){
        User user = userRepository.findByUsername(oauthUser.getUsername());

        if(user == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"사용자를 찾을 수 없습니다.");
        }

        Payment payment = paymentRepository.findByOrderId(orderId);

        if(payment == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"결제 정보를 찾을 수 없습니다.");
        }
        if(!payment.getUser().getId().equals(user.getId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "결제 권한이 없습니다.");
        }

        if(payment.getPaymentState() == PaymentState.DONE){
            return payment.getId();
        }

        if(payment.getPaymentState() != PaymentState.READY){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "결제할 수 없는 상태입니다.");
        }

        if(!payment.getPaymentAmount().equals(amount)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"결제 금액이 일치하지 않습니다.");
        }

        PaymentConfirmResponse toss = requestTossConfirm(paymentKey, orderId, payment.getPaymentAmount());

        if(!"DONE".equals(toss.getStatus())){
            payment.setPaymentState(PaymentState.FAIL);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"결제 승인에 실패했습니다.");
        }

        payment.setPaymentState(PaymentState.DONE);
        payment.setPaymentMethod(toss.getMethod());
        payment.setPaymentDate(OffsetDateTime.parse(toss.getApprovedAt()).toLocalDateTime());

        if(toss.getReceipt() != null) payment.setReceiptUrl(toss.getReceipt().getUrl());

        if(toss.getCard() != null){
            payment.setPaymentInfo(toss.getCard().getApproveNo());
        }

        paymentRepository.save(payment);

        activeMembership(user, payment.getMembershipPlan());

        return payment.getId();

    }

    private PaymentConfirmResponse requestTossConfirm(String paymentKey, String orderId, Long paymentAmount) {
        String encoded = Base64.getEncoder()
                .encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));


        Map<String, Object> body = Map.of(
                "paymentKey", paymentKey,
                "orderId", orderId,
                "amount", paymentAmount
        );


        try{
            return RestClient.create()
                    .post()
                    .uri("https://api.tosspayments.com/v1/payments/confirm")
                    .header("Authorization", "Basic " + encoded)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(PaymentConfirmResponse.class);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"토스 결제 승인 요청에 실패했습니다.",e);
        }
    }

    private void activeMembership(User user, MembershipPlan plan){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiredAt = now.plusMonths(plan.getPeriod());

        UserMembership membership = userMembershipRepository.findByUser(user)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "이용권 정보가 없습니다."));

        membership.Activate(plan,now,expiredAt);
        userMembershipRepository.save(membership);

    }


    public void refundMembership(CustomOAuth2User customOAuth2User){
        User user = userRepository.findByUsername(customOAuth2User.getUsername());
        MembershipPlan freePlan = membershipPlanRepository.findByMembershipCode(SubscriptionCode.FREE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"무료 멤버십이 없습니다."));


        UserMembership membership = userMembershipRepository.findByUser(user)
                .orElseThrow(()-> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"이용권 정보가 없습니다."));


        membership.toFree(freePlan);
        userMembershipRepository.save(membership);

    }

    public PaymentDetailDTO getDetailPayment(CustomOAuth2User customOAuth2User, Long paymentId){

        User user = userRepository.findByUsername(customOAuth2User.getUsername());

        Payment payment = paymentRepository.findByUserAndId(user,paymentId);

        if(payment == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "결제 정보를 찾을 수 없습니다.");
        }
        UserMembership userMembership = userMembershipRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "멤버십 정보를 찾을 수 없습니다."));


        SubscriptionCode code = payment.getMembershipPlan().getMembershipCode();


        return PaymentDetailDTO.builder()
                .id(paymentId)
                .orderId(payment.getOrderId())
                .subscriptionCode(code)
                .effectiveDate(userMembership.getStartedAt())
                .expiredDate(userMembership.getExpiredAt())
                .paymentMethod(payment.getPaymentMethod())
                .paymentInfo(payment.getPaymentInfo())
                .paymentState(payment.getPaymentState().toClientCode())
                .paymentAmount(payment.getPaymentAmount())
                .paymentDate(payment.getPaymentDate())
                .errorCode(null)
                .errorMessage(null)
                .build();


    }



    //결제내역 보여주기
    public PaymentHistoryListDTO getPaymentInfoHistory(CustomOAuth2User customOAuth2User, int page, int size, String paymentStateCode, LocalDate startDate, LocalDate endDate){


        User user = userRepository.findByUsername(customOAuth2User.getUsername());

        if(user == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }

        PaymentState state = toPaymentState(paymentStateCode);
        LocalDateTime start = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime end = (endDate != null) ? endDate.atTime(23, 59, 59) : null;

        boolean hasState = state != null;
        boolean hasStart = start != null;
        boolean hasEnd = end != null;

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());

        Page<Payment> payments = paymentRepository.searchHistory(
                user,
                PaymentState.READY,
                hasState,
                hasState ? state : PaymentState.DONE,
                hasStart,
                hasStart ? start : LocalDateTime.of(1000, 1, 1, 0, 0),
                hasEnd,
                hasEnd ? end : LocalDateTime.of(9999, 12, 31, 23, 59, 59),
                pageable);

        List<PaymentHistoryDTO> historyList = new ArrayList<>();

        for(Payment payment : payments.getContent()){
            LocalDateTime paymentDate = payment.getPaymentDate();
            LocalDateTime expiredDate = null;

            if(paymentDate != null && payment.getMembershipPlan() != null){
                expiredDate = paymentDate.plusMonths(payment.getMembershipPlan().getPeriod());
            }


            historyList.add(PaymentHistoryDTO.builder()
                    .id(payment.getId())
                    .orderId(payment.getOrderId())
                    .subscriptionCode(payment.getMembershipPlan().getMembershipCode())
                    .expiredDate(expiredDate)
                    .effectiveDate(paymentDate)
                    .paymentMethod(payment.getPaymentMethod())
                    .paymentAmount(payment.getPaymentAmount())
                    .paymentState(payment.getPaymentState().toClientCode())
                    .paymentDate(paymentDate)
                    .receiptUrl(payment.getReceiptUrl())
                    .build());
        }

        return PaymentHistoryListDTO.builder()
                .count(historyList.size())
                .totalCount(payments.getTotalElements())
                .items(historyList)
                .build();
    }

    private PaymentState toPaymentState(String paymentStateCode) {
        if(paymentStateCode == null || paymentStateCode.equals("All")){
            return null;//상태 조건 없음
        }

        return switch (paymentStateCode){
            case "PaymentCompleted" -> PaymentState.DONE;
            case "PaymentFailed" -> PaymentState.FAIL;
            case "CancellationComplete" -> PaymentState.CANCEL;
            default -> null;
        };
    }
}
