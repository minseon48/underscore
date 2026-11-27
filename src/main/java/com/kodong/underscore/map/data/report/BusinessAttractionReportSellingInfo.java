package com.kodong.underscore.map.data.report;

import com.kodong.underscore.map.entity.Selling;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;


@Data
public class BusinessAttractionReportSellingInfo {
    private BigDecimal thisMonthSellingAmount;
    private long thisMonthSellingCount;
    private long midweekSellingCount;
    private long weekendSellingCount;
    private long mondaySellingCount;
    private long tuesdaySellingCount;
    private long wednesdaySellingCount;
    private long thursdaySellingCount;
    private long fridaySellingCount;
    private long saturdaySellingCount;
    private long sundaySellingCount;
    private long maleSellingCount;
    private long femaleSellingCount;
    private long ageGrade10SellingCount;
    private long ageGrade20SellingCount;
    private long ageGrade30SellingCount;
    private long ageGrade40SellingCount;
    private long ageGrade50SellingCount;
    private long ageGrade60AndAboveSellingCount;

    @Builder
    public BusinessAttractionReportSellingInfo(Selling selling){
        this.thisMonthSellingAmount = selling.getThisMonthSellingAmt();
        this.thisMonthSellingCount = selling.getThisMonthSellingCount();
        this.midweekSellingCount = selling.getMidweekSellingCount();
        this.weekendSellingCount = selling.getWeekendSellingCount();
        this.mondaySellingCount = selling.getMonSellingCount();
        this.tuesdaySellingCount = selling.getTuesSellingCount();
        this.wednesdaySellingCount = selling.getWedSellingCount();
        this.thursdaySellingCount = selling.getThurSellingCount();
        this.fridaySellingCount = selling.getFriSellingCount();
        this.saturdaySellingCount = selling.getSatSellingCount();
        this.sundaySellingCount = selling.getSunSellingCount();
        this.maleSellingCount = selling.getMlSellingCount();
        this.femaleSellingCount = selling.getFmlSellingCount();
        this.ageGrade10SellingCount = selling.getAgeGrade10SellingCount();
        this.ageGrade20SellingCount = selling.getAgeGrade20SellingCount();
        this.ageGrade30SellingCount = selling.getAgeGrade30SellingCount();
        this.ageGrade40SellingCount = selling.getAgeGrade40SellingCount();
        this.ageGrade50SellingCount = selling.getAgeGrade50SellingCount();
        this.ageGrade60AndAboveSellingCount = selling.getAgeGrade60AboveSellingCount();
    }

}
