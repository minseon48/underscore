package com.kodong.underscore.membership;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Getter
@RequiredArgsConstructor
public enum SubscriptionCode {
    FREE("free"),
    MONTH("month"),
    YEAR("year");

    @JsonValue
    private final String value;

    public static SubscriptionCode fromValue(String value) {
        for (SubscriptionCode code : values()) {
            if (code.value.equals(value)) {
                return code;
            }
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 이용권 코드입니다.");
    }
}
