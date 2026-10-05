package com.kodong.underscore.membership.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MembershipResponse {
    private boolean isSubscribed;
    private String subscriptionCode;

    @JsonProperty("effectiveDate")
    private LocalDateTime startedAt;

    @JsonProperty("expirationDate")
    private LocalDateTime expiredAt;
    private String paymentMethod;
    private String paymentInfo;
    private Integer paymentAmount;
    private Integer refundAmount;
}
