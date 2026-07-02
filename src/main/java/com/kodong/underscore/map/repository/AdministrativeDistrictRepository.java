package com.kodong.underscore.map.repository;

import com.kodong.underscore.map.entity.AdministrativeDistrict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdministrativeDistrictRepository extends JpaRepository<AdministrativeDistrict, Long> {
    Optional<AdministrativeDistrict> findByAdministrativeCode(String administrativeCode);

    @Query("SELECT ad FROM AdministrativeDistrict ad WHERE ad.xLongitude BETWEEN :minXLongitude AND :maxXLongitude AND ad.yLatitude BETWEEN :minYLatitude AND :maxYLatitude")
    List<AdministrativeDistrict> findByXLongitudeBetweenAndYLatitudeBetween(double minXLongitude, double maxXLongitude, double minYLatitude, double maxYLatitude);
}
