package com.kodong.underscore.membership.repository;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.membership.SubscriptionCode;
import com.kodong.underscore.membership.entity.MembershipPlan;
import com.kodong.underscore.membership.entity.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserMembershipRepository extends JpaRepository<UserMembership,Long> {
    Optional<UserMembership> findByUser(User user);


    @Query("""
            SELECT um FROM UserMembership um
            JOIN um.currentPlan p
            WHERE p.membershipCode <> :freeCode
               AND um.expiredAt IS NOT NULL
               AND um.expiredAt < :todayStart             
            """)
    List<UserMembership> findExpiredPaidMemberships(
            @Param("freeCode")SubscriptionCode freeCode,
            @Param("todayStart") LocalDateTime todayStart
            );
}
