package com.kodong.underscore.map.repository;

import com.kodong.underscore.map.entity.BusinessAttraction;
import com.kodong.underscore.map.entity.BusinessAttractionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessAttractionRepository extends JpaRepository<BusinessAttraction, BusinessAttractionId> {
}
