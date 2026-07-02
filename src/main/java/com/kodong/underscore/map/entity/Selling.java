package com.kodong.underscore.map.entity;

import com.kodong.underscore.map.dto.SellingDTO;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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
    private BigDecimal thisMonthSellingAmt;
    private long thisMonthSellingCount;
    private BigDecimal midweekSellingAmt;
    private BigDecimal weekendSellingAmt;
    private BigDecimal monSellingAmt;
    private BigDecimal tuesSellingAmt;
    private BigDecimal wedSellingAmt;
    private BigDecimal thurSellingAmt;
    private BigDecimal friSellingAmt;
    private BigDecimal satSellingAmt;
    private BigDecimal sunSellingAmt;
    private BigDecimal tmzon0006SellingAmt;
    private BigDecimal tmzon0611SellingAmt;
    private BigDecimal tmzon1114SellingAmt;
    private BigDecimal tmzon1417SellingAmt;
    private BigDecimal tmzon1721SellingAmt;
    private BigDecimal tmzon2124SellingAmt;
    private BigDecimal mlSellingAmt;
    private BigDecimal fmlSellingAmt;
    private BigDecimal ageGrade10SellingAmt;
    private BigDecimal ageGrade20SellingAmt;
    private BigDecimal ageGrade30SellingAmt;
    private BigDecimal ageGrade40SellingAmt;
    private BigDecimal ageGrade50SellingAmt;
    private BigDecimal ageGrade60AboveSellingAmt;
    private long midweekSellingCount;
    private long weekendSellingCount;
    private long monSellingCount;
    private long tuesSellingCount;
    private long wedSellingCount;
    private long thurSellingCount;
    private long friSellingCount;
    private long satSellingCount;
    private long sunSellingCount;
    private long tmzon0006SellingCount;
    private long tmzon0611SellingCount;
    private long tmzon1114SellingCount;
    private long tmzon1417SellingCount;
    private long tmzon1721SellingCount;
    private long tmzon2124SellingCount;
    private long mlSellingCount;
    private long fmlSellingCount;
    private long ageGrade10SellingCount;
    private long ageGrade20SellingCount;
    private long ageGrade30SellingCount;
    private long ageGrade40SellingCount;
    private long ageGrade50SellingCount;
    private long ageGrade60AboveSellingCount;

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
