package com.kodong.underscore.membership.entity;

import com.kodong.underscore.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Entity
public class UserMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_plan_id")
    private MembershipPlan currentPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "next_plan_id")
    private MembershipPlan nextPlan;

    private LocalDateTime startedAt;//시작일
    private LocalDateTime expiredAt;//만료일



    public static UserMembership createFree(User user, MembershipPlan freePlan){
        UserMembership userMembership = new UserMembership();

        userMembership.user = user;
        userMembership.currentPlan = freePlan;
        userMembership.nextPlan = freePlan;
        userMembership.startedAt = null;
        userMembership.expiredAt = null;

        return userMembership;
    }

    public void toFree(MembershipPlan freePlan){
        this.startedAt = null;
        this.expiredAt = null;
        this.currentPlan = freePlan;

    }
    public void Activate(MembershipPlan plan, LocalDateTime startedAt, LocalDateTime expiredAt){
        this.currentPlan = plan;
        this.nextPlan = plan;
        this.startedAt = startedAt;
        this.expiredAt = expiredAt;
    }
}
