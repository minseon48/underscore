package com.kodong.underscore.payment.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.kodong.underscore.membership.SubscriptionCode;
import com.kodong.underscore.payment.PaymentState;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
@Builder
public class PaymentDetailDTO {
    private final Long id;
    private final String orderId;
    private final SubscriptionCode subscriptionCode;
    private final LocalDateTime effectiveDate;
    @JsonProperty("expirationDate")
    private final LocalDateTime expiredDate;
    private final String paymentMethod;
    private final String paymentInfo;
    private final String paymentState;
    private final Long paymentAmount;
    private final LocalDateTime paymentDate;
    private final String errorCode;
    private final String errorMessage;



}
