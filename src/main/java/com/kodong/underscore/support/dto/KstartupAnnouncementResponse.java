package com.kodong.underscore.support.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class KstartupAnnouncementResponse {

    @JsonProperty("intg_pbanc_yn")
    private String intgPbancYn;//통합 공고 여부
    @JsonProperty("intg_pbanc_biz_nm")
    private String intgPbancBizNm;//통합 공고 사업명
    @JsonProperty("biz_pbanc_nm")
    private String bizPbancNm;//지원 사업 공고명
    @JsonProperty("pbanc_ctnt")
    private String pbancCtnt;//공고 내용
    @JsonProperty("supt_biz_clsfc")
    private String suptBizClsfc;//지원 분야
    @JsonProperty("aply_trgt_ctnt")
    private String aplyTrgtCtnt;//신청 대상 내용
    @JsonProperty("supt_regin")
    private String suptRegin;//지역명
    @JsonProperty("pbanc_rcpt_bgng_dt")
    private String pbancRcptBgngDt;//공고 접수 시작일
    @JsonProperty("pbanc_rcpt_end_dt")
    private String pbancRcptEndDt;//공고 접수 종료 일시
    @JsonProperty("pbanc_ntrp_nm")
    private String pbancNtrpNm;//창업 지원 기관명
    @JsonProperty("sprv_inst")
    private String sprvInst;//주관 기관
    @JsonProperty("biz_prch_dprt_nm")
    private String bizPrchDprtNm;//사업 담당자 부서명
    @JsonProperty("biz_gdnc_url")
    private String bizGdncUrl;//사업 안내 URL
    @JsonProperty("detl_pg_url")
    private String detlPgUrl;//상세페이지 URL
    @JsonProperty("aply_mthd_vst_rcpt_istc")
    private String aplyMthdVstRcptIstc;//신청 방법 방문 접수 설명
    @JsonProperty("aply_mthd_pssr_rcpt_istc")
    private String aplyMthdPssrRcptIstc;//신청 방법 우편 접수 설명
    @JsonProperty("aply_mthd_fax_rcpt_istc")
    private String aplyMthdFaxRcptIstc;//신청 방법 팩스 접수 설명
    @JsonProperty("aply_mthd_eml_rcpt_istc")
    private String aplyMthdEmlRcptIstc;//신청 방법 이메일 접수 설명
    @JsonProperty("aply_mthd_onli_rcpt_istc")
    private String aplyMthdOnliRcptIstc;//신청 방법 온라인 접수 설명
    @JsonProperty("aply_mthd_etc_istc")
    private String aplyMthdEtcIstc;//신청 방법 기타 설명
    @JsonProperty("aply_exclt_trgt_ctnt")
    private String aplyExcltTrgtCtnt;//신청 제외 대상 내용
    @JsonProperty("aply_trgt")
    private String aplyTrgt;//신청 대상
    @JsonProperty("biz_enyy")
    private String bizEnyy;//창업 기간
    @JsonProperty("biz_trgt_age")
    private String bizTrgtAge;//대상 연령
    @JsonProperty("prfn_matr")
    private String prfnMatr;//우대 사항
    @JsonProperty("Rcrt_prgs_yn")
    private String rcrtPrgsYn;//모집 진행 여부
    @JsonProperty("pbanc_sn")
    private String pbancSn;//공고 일련 번호
}
