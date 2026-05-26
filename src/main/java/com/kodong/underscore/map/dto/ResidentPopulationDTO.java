package com.kodong.underscore.map.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kodong.underscore.map.entity.AdministrativeDistrict;
import com.kodong.underscore.map.entity.ResidentPopulation;
import lombok.Data;

@Data
public class ResidentPopulationDTO {
    @JsonProperty("STDR_YYQU_CD")
    private String standardYearQuarterCode;//기준 년·분기 코드

    @JsonProperty("ADSTRD_CD")
    private String adstrdCode;//행정동 코드

    @JsonProperty("ADSTRD_CD_NM")
    private String adstrdCodeName;//행정동 이름

    @JsonProperty("TOT_REPOP_CO")
    private int totalRepopCount;//총 상주인구 수

    @JsonProperty("ML_REPOP_CO")
    private int maleRepopCount;//남성 상주인구 수

    @JsonProperty("FML_REPOP_CO")
    private int femaleRepopCount;//여성 상주인구 수

    @JsonProperty("AGRDE_10_REPOP_CO")
    private int age10RepopCount;//10대 상주인구 수

    @JsonProperty("AGRDE_20_REPOP_CO")
    private int age20RepopCount;//20대 상주인구 수

    @JsonProperty("AGRDE_30_REPOP_CO")
    private int age30RepopCount;//30대 상주인구 수

    @JsonProperty("AGRDE_40_REPOP_CO")
    private int age40RepopCount;//40대 상주인구 수

    @JsonProperty("AGRDE_50_REPOP_CO")
    private int age50RepopCount;//50대 상주인구 수

    @JsonProperty("AGRDE_60_ABOVE_REPOP_CO")
    private int age60AboveRepopCount;//60대 상주인구 수

    @JsonProperty("MAG_10_REPOP_CO")
    private int maleAge10RepopCount;//남성 10대 상주인구 수

    @JsonProperty("MAG_20_REPOP_CO")
    private int maleAge20RepopCount;//남성 20대 상주인구 수

    @JsonProperty("MAG_30_REPOP_CO")
    private int maleAge30RepopCount;//남성 30대 상주인구 수

    @JsonProperty("MAG_40_REPOP_CO")
    private int maleAge40RepopCount;//남성 40대 상주인구 수

    @JsonProperty("MAG_50_REPOP_CO")
    private int maleAge50RepopCount;//남성 50대 상주인구 수

    @JsonProperty("MAG_60_ABOVE_REPOP_CO")
    private int maleAge60AboveRepopCount;//남성 60대 상주인구 수

    @JsonProperty("FAG_10_REPOP_CO")
    private int femaleAge10RepopCount;//여성 10대 상주인구 수

    @JsonProperty("FAG_20_REPOP_CO")
    private int femaleAge20RepopCount;//여성 20대 상주인구 수

    @JsonProperty("FAG_30_REPOP_CO")
    private int femaleAge30RepopCount;//여성 30대 상주인구 수

    @JsonProperty("FAG_40_REPOP_CO")
    private int femaleAge40RepopCount;//여성 40대 상주인구 수

    @JsonProperty("FAG_50_REPOP_CO")
    private int femaleAge50RepopCount;//여성 50대 상주인구 수

    @JsonProperty("FAG_60_ABOVE_REPOP_CO")
    private int femaleAge60AboveRepopCount;//여성 60대 상주인구 수

    @JsonProperty("TOT_HSHLD_CO")
    private int totalHouseholdCount;//총 가구 수

    @JsonProperty("APT_HSHLD_CO")
    private int apartmentHouseholdCount;//아파트 가구 수

    @JsonProperty("NON_APT_HSHLD_CO")
    private int nonApartmentHouseholdCount;//비아파트 가구 수


    public ResidentPopulation convertToResidentPopulation(AdministrativeDistrict dong, ResidentPopulationDTO repop){
        return ResidentPopulation.builder()
                .dong(dong)
                .repop(repop)
                .build();
    }
}
