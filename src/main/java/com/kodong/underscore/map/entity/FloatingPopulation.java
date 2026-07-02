package com.kodong.underscore.map.entity;

import com.kodong.underscore.map.dto.FloatingPopulationDTO;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class FloatingPopulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="administrative_dong_id")
    private AdministrativeDistrict administrativeDistrict;

    private String standardYearQuarterCode;

    private int totFlpopCo; //총 유동인구 수
    private int mlFlpopCo;//남성 유동인구 수
    private int fmlFlpopCo;//여성 유동인구 수
    private int agrde10FlpopCo;//10대 유동인구 수
    private int agrde20FlpopCo;//20대 유동인구 수
    private int agrde30FlpopCo;//30대 유동인구 수
    private int agrde40FlpopCo;//40대 유동인구 수
    private int agrde50FlpopCo;//50대 유동인구 수
    private int agrde60AboveFlpopCo;//60대 유동인구 수
    private int tmzon0006FlpopCo;//00시~06시
    private int tmzon0611FlpopCo;//06시~11시
    private int tmzon1114FlpopCo;//11시~14시
    private int tmzon1417FlpopCo;//14시~17시
    private int tmzon1721FlpopCo;//17시~21시
    private int tmzon2124FlpopCo;//21시~24시
    private int monFlpopCo;//월요일 유동인구 수
    private int tuesFlpopCo;//화요일 유동인구 수
    private int wedFlpopCo;//수요일 유동인구 수
    private int thurFlpopCo;//목요일 유동인구 수
    private int friFlpopCo;//금요일 유동인구 수
    private int satFlpopCo;//토요일 유동인구 수
    private int sunFlpopCo;//일요일 유동인구 수


    @Builder
    public FloatingPopulation(AdministrativeDistrict dong, FloatingPopulationDTO floatingDTO){
        this.administrativeDistrict = dong;
        this.standardYearQuarterCode = floatingDTO.getStandardYearQuarterCode();
        this.totFlpopCo = floatingDTO.getTotFlpopCo();
        this.mlFlpopCo = floatingDTO.getMlFlpopCo();
        this.fmlFlpopCo = floatingDTO.getFmlFlpopCo();
        this.agrde10FlpopCo = floatingDTO.getAgrde10FlpopCo();
        this.agrde20FlpopCo = floatingDTO.getAgrde20FlpopCo();
        this.agrde30FlpopCo = floatingDTO.getAgrde30FlpopCo();
        this.agrde40FlpopCo = floatingDTO.getAgrde40FlpopCo();
        this.agrde50FlpopCo = floatingDTO.getAgrde50FlpopCo();
        this.agrde60AboveFlpopCo = floatingDTO.getAgrde60AboveFlpopCo();
        this.tmzon0006FlpopCo = floatingDTO.getTmzon0006FlpopCo();
        this.tmzon0611FlpopCo = floatingDTO.getTmzon0611FlpopCo();
        this.tmzon1114FlpopCo = floatingDTO.getTmzon1114FlpopCo();
        this.tmzon1417FlpopCo = floatingDTO.getTmzon1417FlpopCo();
        this.tmzon1721FlpopCo = floatingDTO.getTmzon1721FlpopCo();
        this.tmzon2124FlpopCo = floatingDTO.getTmzon2124FlpopCo();
        this.monFlpopCo = floatingDTO.getMonFlpopCo();
        this.tuesFlpopCo = floatingDTO.getTuesFlpopCo();
        this.wedFlpopCo = floatingDTO.getWedFlpopCo();
        this.thurFlpopCo = floatingDTO.getThurFlpopCo();
        this.friFlpopCo = floatingDTO.getFriFlpopCo();
        this.satFlpopCo = floatingDTO.getSatFlpopCo();
        this.sunFlpopCo = floatingDTO.getSunFlpopCo();
    }

}

