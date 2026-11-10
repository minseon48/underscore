package com.kodong.underscore.checklist.entity;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.myplace.entity.MyplaceGroup;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Entity
public class Checklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private MyplaceGroup group;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(length = 500)
    private String memo;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public static Checklist create(User user, MyplaceGroup group, String title, String memo){
        Checklist checklist = new Checklist();

        checklist.user = user;
        checklist.group = group;
        checklist.title = title;
        checklist.memo = memo;
        checklist.createdAt = LocalDateTime.now();

        return checklist;
    }
}
