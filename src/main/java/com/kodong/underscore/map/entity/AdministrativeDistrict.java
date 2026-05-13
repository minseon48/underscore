package com.kodong.underscore.map.entity;

import com.kodong.underscore.map.dto.AdministrativeDistrictDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdministrativeDistrict {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //시,도
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

    @Builder
    public AdministrativeDistrict(AdministrativeDistrictDTO dto){
        this.siDo = dto.getSiDo();
        this.siGunGu = dto.getSiGunGu();
        this.administrativeDong = dto.getAdministrativeDong();
        this.administrativeClassification = dto.getAdministrativeClassification();
        this.administrativeCode = dto.getAdministrativeCode();
        this.administrativeOrganizationCreationDate = dto.getAdministrativeOrganizationCreationDate();
        this.xLongitude = dto.getXLongitude();
        this.yLatitude = dto.getYLatitude();
    }
}
