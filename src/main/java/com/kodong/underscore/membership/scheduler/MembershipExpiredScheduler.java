package com.kodong.underscore.membership.scheduler;

import com.kodong.underscore.membership.service.MembershipService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class MembershipExpiredScheduler {

    private final MembershipService membershipService;

    @Scheduled(cron = "30 0 0 * * *", zone = "Asia/Seoul")
    public void convertExpiredMembershipToFree(){
        log.info("만료 멤버십 무료 전환 스케줄 시작");

        try{
            int count = membershipService.convertExpiredMembershipsToFree();
        }catch(Exception e){
            log.error("만료 멤버십 무료 전환 스케줄 실패",e);
        }
    }
}
