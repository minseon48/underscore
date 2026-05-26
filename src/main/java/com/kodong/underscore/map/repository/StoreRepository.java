package com.kodong.underscore.map.repository;

import com.kodong.underscore.map.entity.AdministrativeDistrict;
import com.kodong.underscore.map.entity.ServiceIndustry;
import com.kodong.underscore.map.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store,Long> {
    Optional<Store> findByStandardYearQuarterCodeAndAdministrativeDistrictAndServiceIndustry(
            String standardYearQuarterCode, AdministrativeDistrict administrativeDistrict, ServiceIndustry serviceIndustry
    );
    List<Store> findAllByServiceIndustryAndStandardYearQuarterCodeOrderBySimilarIndustryStoreCount(ServiceIndustry serviceIndustry, String standardYearQuarterCode);

}
