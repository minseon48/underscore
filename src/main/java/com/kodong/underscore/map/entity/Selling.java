package com.kodong.underscore.map.entity;

import com.kodong.underscore.map.dto.SellingDTO;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
public class Selling {
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
    private long thisMonthSellingAmt;//당월 매출 금액
    private long thisMonthSellingCount;//당월 매출 건수
    private long midweekSellingAmt;//주중 매출 금액
    private long weekendSellingAmt;//주말 매출 금액
    private long monSellingAmt;//월요일 매출 금액
    private long tuesSellingAmt;//화요일 매출 금액
    private long wedSellingAmt;//수요일 매출 금액
    private long thurSellingAmt;//목요일 매출 금액
    private long friSellingAmt;//금요일 매출 금액
    private long satSellingAmt;//토요일 매출 금액
    private long sunSellingAmt;//일요일 매출 금액
    private long tmzon0006SellingAmt;//00시~06시
    private long tmzon0611SellingAmt;//06시~11시
    private long tmzon1114SellingAmt;//11시~14시
    private long tmzon1417SellingAmt;//14시~17시
    private long tmzon1721SellingAmt;//17시~21시
    private long tmzon2124SellingAmt;//21시~24시
    private long mlSellingAmt;//남성 매출 금액
    private long fmlSellingAmt;//여성 매출 금액
    private long ageGrade10SellingAmt;//10대 매출 금액
    private long ageGrade20SellingAmt;//20대 매출 금액
    private long ageGrade30SellingAmt;//30대 매출 금액
    private long ageGrade40SellingAmt;//40대 매출 금액
    private long ageGrade50SellingAmt;//50대 매출 금액
    private long ageGrade60AboveSellingAmt;//60대 이상 매출 금액
    private long midweekSellingCount;//주중 매출 건수
    private long weekendSellingCount;//주말 매출 건수
    private long monSellingCount;//월요일 매출 건수
    private long tuesSellingCount;//화요일 매출 건수
    private long wedSellingCount;//수요일 매출 건수
    private long thurSellingCount;//목요일 매출 건수
    private long friSellingCount;//금요일 매출 건수
    private long satSellingCount;//토요일 매출 건수
    private long sunSellingCount;//일요일 매출 건수
    private long tmzon0006SellingCount;//00시~06시
    private long tmzon0611SellingCount;//06시~11시
    private long tmzon1114SellingCount;//11시~14시
    private long tmzon1417SellingCount;//14시~17시
    private long tmzon1721SellingCount;//17시~21시
    private long tmzon2124SellingCount;//21시~24시
    private long mlSellingCount;//남성 매출 건수
    private long fmlSellingCount;//여성 매출 건수
    private long ageGrade10SellingCount;//10대 매출 건수
    private long ageGrade20SellingCount;//20대 매출 건수
    private long ageGrade30SellingCount;//30대 매출 건수
    private long ageGrade40SellingCount;//40대 매출 건수
    private long ageGrade50SellingCount;//50대 매출 건수
    private long ageGrade60AboveSellingCount;//60대 이상 매출 건수

    @Builder
    public Selling(AdministrativeDistrict dong, ServiceIndustry serviceIndustry, SellingDTO sellingDTO){
        this.administrativeDistrict = dong;
        this.serviceIndustry = serviceIndustry;
        this.standardYearQuarterCode = sellingDTO.getStandardYearQuarterCode();
        this.thisMonthSellingAmt = sellingDTO.getThisMonthSellingAmt();
        this.thisMonthSellingCount = sellingDTO.getThisMonthSellingCount();
        this.midweekSellingAmt = sellingDTO.getMidweekSellingAmt();
        this.weekendSellingAmt = sellingDTO.getWeekendSellingAmt();
        this.monSellingAmt = sellingDTO.getMonSellingAmt();
        this.tuesSellingAmt = sellingDTO.getTuesSellingAmt();
        this.wedSellingAmt = sellingDTO.getWedSellingAmt();
        this.thurSellingAmt = sellingDTO.getThurSellingAmt();
        this.friSellingAmt = sellingDTO.getFriSellingAmt();
        this.satSellingAmt = sellingDTO.getSatSellingAmt();
        this.sunSellingAmt = sellingDTO.getSunSellingAmt();
        this.tmzon0006SellingAmt = sellingDTO.getTmzon0006SellingAmt();
        this.tmzon0611SellingAmt = sellingDTO.getTmzon0611SellingAmt();
        this.tmzon1114SellingAmt = sellingDTO.getTmzon1114SellingAmt();
        this.tmzon1417SellingAmt = sellingDTO.getTmzon1417SellingAmt();
        this.tmzon1721SellingAmt = sellingDTO.getTmzon1721SellingAmt();
        this.tmzon2124SellingAmt = sellingDTO.getTmzon2124SellingAmt();
        this.mlSellingAmt = sellingDTO.getMlSellingAmt();
        this.fmlSellingAmt = sellingDTO.getFmlSellingAmt();
        this.ageGrade10SellingAmt = sellingDTO.getAgeGrade10SellingAmt();
        this.ageGrade20SellingAmt = sellingDTO.getAgeGrade20SellingAmt();
        this.ageGrade30SellingAmt = sellingDTO.getAgeGrade30SellingAmt();
        this.ageGrade40SellingAmt = sellingDTO.getAgeGrade40SellingAmt();
        this.ageGrade50SellingAmt = sellingDTO.getAgeGrade50SellingAmt();
        this.ageGrade60AboveSellingAmt = sellingDTO.getAgeGrade60AboveSellingAmt();
        this.midweekSellingCount = sellingDTO.getMidweekSellingCount();
        this.weekendSellingCount = sellingDTO.getWeekendSellingCount();
        this.monSellingCount = sellingDTO.getMonSellingCount();
        this.tuesSellingCount = sellingDTO.getTuesSellingCount();
        this.wedSellingCount = sellingDTO.getWedSellingCount();
        this.thurSellingCount = sellingDTO.getThurSellingCount();
        this.friSellingCount = sellingDTO.getFriSellingCount();
        this.satSellingCount = sellingDTO.getSatSellingCount();
        this.sunSellingCount = sellingDTO.getSunSellingCount();
        this.tmzon0006SellingCount = sellingDTO.getTmzon0006SellingCount();
        this.tmzon0611SellingCount = sellingDTO.getTmzon0611SellingCount();
        this.tmzon1114SellingCount = sellingDTO.getTmzon1114SellingCount();
        this.tmzon1417SellingCount = sellingDTO.getTmzon1417SellingCount();
        this.tmzon1721SellingCount = sellingDTO.getTmzon1721SellingCount();
        this.tmzon2124SellingCount = sellingDTO.getTmzon2124SellingCount();
        this.mlSellingCount = sellingDTO.getMlSellingCount();
        this.fmlSellingCount = sellingDTO.getFmlSellingCount();
        this.ageGrade10SellingCount = sellingDTO.getAgeGrade10SellingCount();
        this.ageGrade20SellingCount = sellingDTO.getAgeGrade20SellingCount();
        this.ageGrade30SellingCount = sellingDTO.getAgeGrade30SellingCount();
        this.ageGrade40SellingCount = sellingDTO.getAgeGrade40SellingCount();
        this.ageGrade50SellingCount = sellingDTO.getAgeGrade50SellingCount();
        this.ageGrade60AboveSellingCount = sellingDTO.getAgeGrade60AboveSellingCount();
    }
}
