package com.kodong.underscore.payment.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class PaymentConfirmResponse {
    private final String mid;
    private final String lastTransactionKey;//마지막 거래 키값
    private final String paymentKey;
    private final String orderId;
    private final String orderName;
    private final Integer taxExemptionAmount;
    private final String status;//결제 처리 상태
    private final String requestedAt;//결제 날짜 및 시간 정보
    private final String approvedAt;//결제 승인 날짜 및 시간 정보
    private final boolean useEscrow;//에스크로 사용 여부
    private final boolean cultureExpense;//문화비 지출 여부
    private final Card card;
    private final boolean isInterestFree;//무이자 할부 적용 여부
    private final String interestPayer;//할부 수수료 부담 주체
    private final String country;//결제한 국가
    private final Failure failure;//에러 객체
    private final boolean isPartialCancelable;//부분 취소 가능 여부
    private final String currency;//결제 시 사용한 통화
    private final int totalAmount;//총 결제 금액
    private final int balanceAmount;//취소할 수 있는 금액
    private final int suppliedAmount;//공급가액
    private final String method;//결제수단
    private final Receipt receipt;//영수증



    @Data
    public static class Card{
        private final int amount;
        private final String issuerCode;//카드 발급사 코드
        private final String acquirerCode;//카드 매입사 코드
        private final Integer installmentPlanMonths;//할부 개월 수
        private final String approveNo;//카드사 승인 번호
        private final boolean useCardPoint;//카드사 포인트 사용 여부
        private final String cardType;//카드 종류
        private final String ownerType;//카드의 소유자 타입(개인,법인,미확인)
        private final String acquireStatus;//카드 결제 매입 상태

    }

    @Data
    public static class Failure{
        private final String code;
        private final String message;
    }

    @Data
    public static class Receipt{
        private final String url;
    }
}

