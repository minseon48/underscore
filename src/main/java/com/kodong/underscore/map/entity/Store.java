package com.kodong.underscore.map.entity;

import com.kodong.underscore.map.dto.StoreDTO;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "administrative_dong_id")
    private AdministrativeDistrict administrativeDistrict;

    @ManyToOne
    @JoinColumn(name = "service_industry_id")
    private ServiceIndustry serviceIndustry;

    private String standardYearQuarterCode;
    private int storeCount;//점포 수
    private int similarIndustryStoreCount;//유사 업종 점포 수
    private int openingBusinessRate;//개업률
    private int openingBusinessStoreCount;//개업 점포 수
    private int closingBusinessRate;//폐업률
    private int closingBusinessStoreCount;//폐업 점포 수
    private int franchiseStoreCount;//프랜차이즈 점포 수

    @Builder
    public Store(AdministrativeDistrict dong,ServiceIndustry serviceIndustry, StoreDTO store){
        this.administrativeDistrict = dong;
        this.serviceIndustry = serviceIndustry;
        this.standardYearQuarterCode = store.getStandardYearQuarterCode();
        this.storeCount = store.getStoreCount();
        this.similarIndustryStoreCount = store.getSimilarIndustryStoreCount();
        this.openingBusinessRate = store.getOpeningBusinessRate();
        this.openingBusinessStoreCount = store.getOpeningBusinessStoreCount();
        this.closingBusinessRate = store.getClosingBusinessRate();
        this.closingBusinessStoreCount = store.getClosingBusinessStoreCount();
        this.franchiseStoreCount = store.getFranchiseStoreCount();
    }
}
