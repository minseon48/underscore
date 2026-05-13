package com.kodong.underscore.map.repository;

import com.kodong.underscore.map.entity.AdministrativeDistrict;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdministrativeDistrictRepository extends JpaRepository<AdministrativeDistrict, Long> {
    Optional<AdministrativeDistrict> findByAdministrativeCode(String administrativeCode);
}
