package com.kodong.underscore.payment.controller;

import com.kodong.underscore.auth.dto.CustomOAuth2User;
import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.payment.dto.*;
import com.kodong.underscore.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/payment")
public class PayController {

    private final PaymentService paymentService;
    
    @PostMapping("/orders")
    public PaymentResponse createOrder(@AuthenticationPrincipal CustomOAuth2User user,
                                       @RequestBody PaymentOrderRequest request){

        String subscriptionCode = request.getSubscriptionCode();



        return paymentService.createPaymentOrder(user,subscriptionCode);
    }


    @PostMapping("/confirm")
    public Map<String,Long> requestTossPayments(@AuthenticationPrincipal CustomOAuth2User user,
                                                @RequestBody PaymentConfirmRequest request){

        Long paymentId = paymentService.ConfirmRequestTossPayments(user,
                request.getPaymentKey(),
                request.getOrderId(),
                request.getAmount());


        return Map.of("paymentId",paymentId);
    }

    @PostMapping("/leave")
    public void leaveMembership(@AuthenticationPrincipal CustomOAuth2User user){
        paymentService.refundMembership(user);
    }


    @GetMapping("/history")
    public PaymentHistoryListDTO getPaymentHistory(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                                   @RequestParam(defaultValue = "1") int page,
                                                   @RequestParam(defaultValue = "10") int size,
                                                   @RequestParam(required = false) String paymentStateCode,
                                                   @RequestParam(required = false) LocalDate startDate,
                                                   @RequestParam(required = false) LocalDate endDate){
        PaymentHistoryListDTO paymentInfoHistory = paymentService.getPaymentInfoHistory(customOAuth2User, page, size,paymentStateCode, startDate, endDate);

        return paymentInfoHistory;
    }

    @GetMapping("/{id}")
    public PaymentDetailDTO getPaymentDetailInfo(@AuthenticationPrincipal CustomOAuth2User customOAuth2User,
                                                 @PathVariable Long id){

        PaymentDetailDTO detailPayment = paymentService.getDetailPayment(customOAuth2User, id);


        return detailPayment;

    }



}
