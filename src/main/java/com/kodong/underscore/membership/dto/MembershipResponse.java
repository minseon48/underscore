package com.kodong.underscore.membership.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MembershipResponse {
    private boolean isSubscribed;
    private String subscriptionCode;
    private LocalDateTime startedAt;
    private LocalDateTime expiredAt;
    private String paymentMethod;
    private String paymentInfo;
    private Integer paymentAmount;
    private Integer refundAmount;
}
