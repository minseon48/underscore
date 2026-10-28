package com.kodong.underscore.myplace.entity;

import com.kodong.underscore.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
public class MyplaceGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false)
    private boolean defaultGroup;

    private LocalDateTime createdAt;

    public static MyplaceGroup createDefault(User user){
        return create(user,"기본 그룹", true);
    }

    public static MyplaceGroup createGroup(User user,String name){
        return create(user,name, false);
    }

    private static MyplaceGroup create(User user, String name, boolean defaultGroup){
        MyplaceGroup myplaceGroup = new MyplaceGroup();

        myplaceGroup.user = user;
        myplaceGroup.name = name;
        myplaceGroup.defaultGroup = defaultGroup;
        myplaceGroup.createdAt = LocalDateTime.now();

        return myplaceGroup;
    }
}
