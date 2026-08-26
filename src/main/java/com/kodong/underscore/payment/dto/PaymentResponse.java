package com.kodong.underscore.payment.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Builder
@RequiredArgsConstructor
@Getter
public class PaymentResponse {
    private final String customerKey;
    private final String orderId;
    private final String orderName;
    private final int amount;

}
