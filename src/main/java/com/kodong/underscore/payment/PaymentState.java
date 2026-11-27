package com.kodong.underscore.payment;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PaymentState {
    READY,//대기
    DONE,//완료
    FAIL,//실패
    CANCEL;//취소


    public String toClientCode(){
        return switch (this){
            case READY -> "PaymentScheduled";
            case DONE -> "PaymentCompleted";
            case FAIL -> "PaymentFailed";
            case CANCEL -> "CancellationComplete";
        };
    }
}
