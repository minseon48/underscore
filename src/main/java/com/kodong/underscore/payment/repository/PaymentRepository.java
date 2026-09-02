package com.kodong.underscore.payment.repository;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.payment.PaymentState;
import com.kodong.underscore.payment.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    Payment findByOrderId(String orderId);
    Payment findByUserAndId(User user, Long id);

    @Query("""
            SELECT p FROM Payment p
            WHERE p.user = :user
            AND p.paymentState <> :ready
            AND (:hasState = false OR p.paymentState = :state)
            AND (:hasStart = false OR p.paymentDate >= :start)
            AND (:hasEnd = false OR p.paymentDate <= :end)
            """)
    Page<Payment> searchHistory(
            @Param("user") User user,
            @Param("ready") PaymentState ready,
            @Param("hasState") boolean hasState,
            @Param("state") PaymentState state,
            @Param("hasStart") boolean hasStart,
            @Param("start") LocalDateTime start,
            @Param("hasEnd") boolean hasEnd,
            @Param("end") LocalDateTime end,
            Pageable pageable);
}
