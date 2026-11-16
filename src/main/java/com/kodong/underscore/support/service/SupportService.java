package com.kodong.underscore.support.service;

import com.kodong.underscore.support.dto.KstartupAnnouncementListResponse;
import com.kodong.underscore.support.dto.KstartupAnnouncementResponse;
import com.kodong.underscore.support.dto.SupportItemResponse;
import com.kodong.underscore.support.dto.SupportListInfoResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
public class SupportService {

    @Value("${spring.kstartup.service-key}")
    private String serviceKey;

    private static final String BASE_URL =
            "https://apis.data.go.kr/B552735/kisedKstartupService01/getAnnouncementInformation01";


    public SupportListInfoResponse getSupport(int page, int size,
                                              String startDate, String endDate,
                                              String region, String recruitmentStatus){
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(BASE_URL)
                .queryParam("serviceKey",serviceKey)
                .queryParam("page",page)
                .queryParam("perPage",size)
                .queryParam("returnType","json");

        //접수 시작일
        if(startDate != null && !startDate.isBlank()){
            builder.queryParam("cond[pbanc_rcpt_bgng_dt::GTE]",toYmd(startDate));
        }

        //접수 종료일
        if(endDate != null && !endDate.isBlank()){
            builder.queryParam(("cond[pbanc_rcpt_end_dt::LTE]"),toYmd(endDate));
        }

        if (region != null && !region.isBlank() && !"All".equals(region)) {
            builder.queryParam("cond[supt_regin::LIKE]", region);
        }

        // 모집상태: API rcrt_prgs_yn 대신 날짜 조건으로 후보를 좁힌 뒤 toRcrtPrgsYn으로 후필터
        String today = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        if ("Y".equals(recruitmentStatus)) {
            builder.queryParam("cond[pbanc_rcpt_bgng_dt::LTE]", today);
            builder.queryParam("cond[pbanc_rcpt_end_dt::GTE]", today);
        } else if ("S".equals(recruitmentStatus)) {
            builder.queryParam("cond[pbanc_rcpt_bgng_dt::GTE]", today);
        } else if ("N".equals(recruitmentStatus)) {
            builder.queryParam("cond[pbanc_rcpt_end_dt::LTE]", today);
        }

        URI uri = builder.build(false).toUri();

        log.info("uri = {}", uri);

        RestClient restClient = RestClient.builder().build();

        KstartupAnnouncementListResponse response = restClient.get()
                .uri(uri)
                .retrieve()
                .body(KstartupAnnouncementListResponse.class);

        boolean filterByRecruitment =
                recruitmentStatus != null && !recruitmentStatus.isBlank();

        List<SupportItemResponse> items = (response == null || response.getData() == null)
                ? List.of()
                : response.getData().stream()
                        .map(this::toItem)
                        .filter(item -> !filterByRecruitment
                                || recruitmentStatus.equals(item.getRcrtPrgsYn()))
                        .toList();

        return SupportListInfoResponse.builder()
                .count(items.size())
                .totalCount(filterByRecruitment
                        ? items.size()
                        : (response != null ? response.getTotalCount() : 0))
                .items(items)
                .build();

    }

    private SupportItemResponse toItem(KstartupAnnouncementResponse announcementResponse) {
        return SupportItemResponse.builder()
                .pbancSn(announcementResponse.getPbancSn())
                .bizPbancNm(announcementResponse.getBizPbancNm())
                .suptBizClsfc(announcementResponse.getSuptBizClsfc())
                .suptRegin(announcementResponse.getSuptRegin())
                .pbancRcptBgngDt(announcementResponse.getPbancRcptBgngDt())
                .pbancRcptEndDt(announcementResponse.getPbancRcptEndDt())
                .rcrtPrgsYn(toRcrtPrgsYn(
                        announcementResponse.getPbancRcptBgngDt(),
                        announcementResponse.getPbancRcptEndDt()
                ))
                .pbancNtrpNm(announcementResponse.getPbancNtrpNm())
                .sprvInst(announcementResponse.getSprvInst())
                .detlPgUrl(announcementResponse.getDetlPgUrl())
                .build();
    }

    // 모집 상태 기간으로 계산하여 반환
    private String toRcrtPrgsYn(String bgng, String end) {
        if (end == null || end.length() != 8) return "N";
        if (bgng == null || bgng.length() != 8) return "N";

        String today = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE); // yyyyMMdd

        if (today.compareTo(bgng) < 0) {
            return "S";
        }

        return today.compareTo(bgng) >= 0 && today.compareTo(end) <= 0 ? "Y" : "N";
    }


    private String toYmd(String date){
        return date.replaceAll("-","");
    }
}
