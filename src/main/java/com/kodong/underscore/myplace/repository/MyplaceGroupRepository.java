package com.kodong.underscore.myplace.repository;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.myplace.entity.MyplaceGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MyplaceGroupRepository extends JpaRepository<MyplaceGroup, Long> {
    List<MyplaceGroup> findAllByUserOrderByIdAsc(User user);

    boolean existsByUserAndId(User user, Long id);
    boolean existsByUserAndName(User user, String name);


    Optional<MyplaceGroup> findByIdAndUser(Long id, User user);
}
