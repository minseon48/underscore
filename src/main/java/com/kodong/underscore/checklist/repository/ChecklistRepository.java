package com.kodong.underscore.checklist.repository;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.checklist.entity.Checklist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChecklistRepository extends JpaRepository<Checklist,Long> {
    List<Checklist> findAllByUserOrderByIdDesc(User user);
    Optional<Checklist> findByIdAndUser(Long id, User user);
}
