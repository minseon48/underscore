package com.kodong.underscore.myplace.entity;

import com.kodong.underscore.auth.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "administrative_code"}))
public class Myplace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private MyplaceGroup group;

    @Column(name = "administrative_code", nullable = false, length = 20)
    private String administrativeCode;

    @Column(nullable = false, length = 100)
    private String addressName;

    private double latitude;
    private double longitude;

    @Column(length = 100)
    private String memo;

    private LocalDateTime createdAt;

    public static Myplace create(User user, MyplaceGroup myplaceGroup,
                                 String administrativeCode, String addressName,
                                 double latitude, double longitude, String memo) {
        Myplace myplace = new Myplace();

        myplace.user = user;
        myplace.group = myplaceGroup;
        myplace.administrativeCode = administrativeCode;
        myplace.addressName = addressName;
        myplace.latitude = latitude;
        myplace.longitude = longitude;
        myplace.memo = memo;
        myplace.createdAt = LocalDateTime.now();

        return myplace;
    }
}
