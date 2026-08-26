package com.kodong.underscore.payment.repository;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    Payment findByOrderId(String orderId);
    Payment findByUserAndId(User user, Long id);
}
