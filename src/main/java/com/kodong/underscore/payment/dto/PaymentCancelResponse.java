package com.kodong.underscore.payment.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class PaymentCancelResponse {
    private String paymentKey;
    private String orderId;
    private String status;
    private List<Cancel> cancels;

    @Data
    @NoArgsConstructor
    public static class Cancel {
        private String transactionKey;
        private String cancelReason;
        private String canceledAt;
        private Long cancelAmount;
        private String cancelStatus;
    }
}
