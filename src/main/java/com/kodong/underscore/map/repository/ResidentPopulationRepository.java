package com.kodong.underscore.map.repository;

import com.kodong.underscore.map.entity.AdministrativeDistrict;
import com.kodong.underscore.map.entity.ResidentPopulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResidentPopulationRepository extends JpaRepository<ResidentPopulation,Long> {
    Optional<ResidentPopulation> findByStandardYearQuarterCodeAndAdministrativeDistrict(String standardYearQuarterCode, AdministrativeDistrict district);
    List<ResidentPopulation> findAllByStandardYearQuarterCodeOrderByTotalRepopCountAsc(String standardYearQuarterCode);


}
