package com.kodong.underscore.map.dto;

import com.kodong.underscore.map.entity.ServiceIndustry;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ServiceIndustryDTO {
    private String serviceIndustryCode;
    private String serviceIndustryCodeName;



    public ServiceIndustry convertToServiceIndustry(ServiceIndustryDTO dto){
        return ServiceIndustry.builder()
                .dto(dto)
                .build();
    }
}
