package com.kodong.underscore.payment.entity;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.membership.entity.MembershipPlan;
import com.kodong.underscore.payment.PaymentState;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@RequiredArgsConstructor
@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private MembershipPlan membershipPlan;

    @Column(nullable = false,unique = true)
    private String orderId;

    private String paymentMethod;
    private String paymentInfo;
    private Long paymentAmount;
    private LocalDateTime paymentDate;
    private LocalDateTime billingDate;

    @Enumerated(EnumType.STRING)
    private PaymentState paymentState;
    private String receiptUrl;
}
