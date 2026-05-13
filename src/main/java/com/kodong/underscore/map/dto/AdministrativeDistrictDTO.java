package com.kodong.underscore.map.dto;

import com.kodong.underscore.map.entity.AdministrativeDistrict;
import lombok.Data;

@Data
public class AdministrativeDistrictDTO {
    // 시, 도
    private String siDo;

    //시,군,구
    private String siGunGu;

    //행정동
    private String administrativeDong;

    //행정구역 분류
    private String administrativeClassification;

    //행정기관 코드
    private String administrativeCode;

    //행정기관 생성일
    private String administrativeOrganizationCreationDate;

    //x좌표, 경도
    private double xLongitude;

    //y좌표, 위도
    private double yLatitude;

    public AdministrativeDistrict convertToAdministrativeDistrictEntity(AdministrativeDistrictDTO administrativeDistrictDTO){
        return AdministrativeDistrict.builder().dto(administrativeDistrictDTO).build();
    }



}
