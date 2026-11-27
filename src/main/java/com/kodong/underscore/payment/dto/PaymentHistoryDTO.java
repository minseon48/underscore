package com.kodong.underscore.payment.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.kodong.underscore.membership.SubscriptionCode;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class PaymentHistoryDTO {
    private final Long id;
    private final String orderId;
    private final SubscriptionCode subscriptionCode;
    private final LocalDateTime effectiveDate;
    @JsonProperty("expirationDate")
    private final LocalDateTime expiredDate;
    private final String paymentState;
    private final String paymentMethod;
    private final Long paymentAmount;
    private final LocalDateTime paymentDate;
    private final String receiptUrl;//결제 영수증 url

}
