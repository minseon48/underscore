package com.kodong.underscore.membership.repository;


import com.kodong.underscore.membership.SubscriptionCode;
import com.kodong.underscore.membership.entity.MembershipPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MembershipPlanRepository extends JpaRepository<MembershipPlan,Long> {
    Optional<MembershipPlan> findByMembershipCode(SubscriptionCode membershipCode);
}
