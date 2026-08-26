package com.kodong.underscore.payment.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentOrderRequest {
    private String subscriptionCode; //month | year
}
