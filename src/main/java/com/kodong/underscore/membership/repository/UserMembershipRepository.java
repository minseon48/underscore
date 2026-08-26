package com.kodong.underscore.membership.repository;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.membership.entity.MembershipPlan;
import com.kodong.underscore.membership.entity.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMembershipRepository extends JpaRepository<UserMembership,Long> {
    Optional<UserMembership> findByUser(User user);



}
