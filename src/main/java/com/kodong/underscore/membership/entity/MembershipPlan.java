package com.kodong.underscore.membership.entity;

import com.kodong.underscore.membership.SubscriptionCode;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
@Entity
public class MembershipPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SubscriptionCode membershipCode;//free,month,year
    private String membershipName;//무료,월간,연간
    private int price;//가격
    private int period;//기간
}
