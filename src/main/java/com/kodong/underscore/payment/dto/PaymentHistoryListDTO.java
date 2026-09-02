package com.kodong.underscore.payment.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PaymentHistoryListDTO {
    private final int count;//페이지 수
    private final Long totalCount;//유저 결제 건수
    private final List<PaymentHistoryDTO> items;

}
