package com.kodong.underscore.support.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SupportItemResponse {
    private String pbancSn;
    private String bizPbancNm;
    private String suptBizClsfc;
    private String suptRegin;
    private String pbancRcptBgngDt;
    private String pbancRcptEndDt;
    private String rcrtPrgsYn;
    private String pbancNtrpNm;
    private String sprvInst;
    private String detlPgUrl;
}
