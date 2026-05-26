package com.kodong.underscore.map.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class BusinessAttractionId implements Serializable {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="administrative_dong_id", referencedColumnName = "id")
    private AdministrativeDistrict administrativeDistrictId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="service_industry_id", referencedColumnName = "id")
    private ServiceIndustry serviceIndustryId;
    private String standardYearQuarterCode;

}
