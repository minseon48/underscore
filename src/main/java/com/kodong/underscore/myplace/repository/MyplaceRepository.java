package com.kodong.underscore.myplace.repository;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.myplace.entity.Myplace;
import com.kodong.underscore.myplace.entity.MyplaceGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MyplaceRepository extends JpaRepository<Myplace,Long> {
    Page<Myplace> findAllByUserAndGroup(User user, MyplaceGroup myplaceGroup, Pageable pageable);
    boolean existsByGroupAndAdministrativeCode(MyplaceGroup myplaceGroup, String administrativeCode);
    int countByGroup(MyplaceGroup myplaceGroup);

    void deleteAllByGroup(MyplaceGroup group);

    boolean existsByUserAndId(User user, Long myplaceId);
}
