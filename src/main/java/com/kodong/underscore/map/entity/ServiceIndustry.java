package com.kodong.underscore.map.entity;

import com.kodong.underscore.map.dto.ServiceIndustryDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class ServiceIndustry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceIndustryCode;
    private String serviceIndustryName;

    @Builder
    public ServiceIndustry(ServiceIndustryDTO dto){
        this.serviceIndustryCode = dto.getServiceIndustryCode();
        this.serviceIndustryName = dto.getServiceIndustryCodeName();
    }
}
