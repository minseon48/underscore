package com.kodong.underscore.map.data;

import com.kodong.underscore.map.entity.ServiceIndustry;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class BusinessAttractionScoringContext {
    //서비스 업종 목록
    private final List<ServiceIndustry> serviceIndustryList= new ArrayList<>();
    //유동인구 임계값 목록
    private final List<Integer> floatingPopulationThresholds = new ArrayList<>();
    //소득·소비 임계값 목록
    private final List<Long>incomeConsumptionThresholds = new ArrayList<>();
    //상주인구 점수 구간 임계값 목록
    private final List<Integer> residentPopulationThresholds= new ArrayList<>();
    //업종 매출 점수 구간 임계값 목록
    private final Map<String,List<Long>> sellingThresholds= new HashMap<>();
    //유사 업종 점포수 점수 구간 임계값 목록
    private final Map<String,List<Integer>> storeThresholds= new HashMap<>();
    /*상권변화지표 코드 문자열 목록
    * LL:다이나믹, LH:상권확장, HH:정체, HL:상권축소*/
    private final List<String> indexQuarterlyQuotientThresholds= new ArrayList<>(Arrays.asList("LL","HH","HL","LH"));
    //기준 연도·분기 코드
    private String standardYearQuarterCode = "20261";


    public List<ServiceIndustry> getServiceIndustryList() {
        return Collections.unmodifiableList(serviceIndustryList);
    }

    public List<Integer> getFloatingPopulationThresholds() {
        return Collections.unmodifiableList(floatingPopulationThresholds);
    }

    public List<Long> getIncomeConsumptionThresholds() {
        return Collections.unmodifiableList(incomeConsumptionThresholds);
    }

    public List<Integer> getResidentPopulationThresholds() {
        return Collections.unmodifiableList(residentPopulationThresholds);
    }

    public Map<String,List<Long>> getSellingThresholds() {
        return Collections.unmodifiableMap(sellingThresholds);
    }

    public Map<String,List<Integer>> getStoreThresholds() {
        return Collections.unmodifiableMap(storeThresholds);
    }

    public List<String> getIndexQuarterlyQuotientThresholds() {
        return Collections.unmodifiableList(indexQuarterlyQuotientThresholds);
    }


    public String getStandardYearQuarterCode() {
        return standardYearQuarterCode;
    }

    public List<String> getStandardYearQuarterCodeAsList(){
        return Collections.singletonList(standardYearQuarterCode);
    }

    public void updateServiceIndustryList(List<ServiceIndustry> serviceIndustries) {
        this.serviceIndustryList.clear();
        this.serviceIndustryList.addAll(serviceIndustries);
    }

    public void updateFloatingPopulationThresholds(List<Integer> floatingPopulationThresholds) {
        this.floatingPopulationThresholds.clear();
        this.floatingPopulationThresholds.addAll(floatingPopulationThresholds);
    }

    public void updateIncomeConsumptionThresholds(List<Long> incomeConsumptionThresholds) {
        this.incomeConsumptionThresholds.clear();
        this.incomeConsumptionThresholds.addAll(incomeConsumptionThresholds);
    }

    public void updateResidentPopulationThresholds(List<Integer> residentPopulationThresholds) {
        this.residentPopulationThresholds.clear();
        this.residentPopulationThresholds.addAll(residentPopulationThresholds);
    }

    public void updateSellingThresholds(Map<String, List<Long>> sellingThresholds) {
        this.sellingThresholds.clear();
        this.sellingThresholds.putAll(sellingThresholds);
    }

    public void updateStoreThresholds(Map<String, List<Integer>> storeThresholds) {
        this.storeThresholds.clear();
        this.storeThresholds.putAll(storeThresholds);
    }

    public void updateIndexQuarterlyThresholds(List<String> indexQuarterlyQuotientThresholds) {
        this.indexQuarterlyQuotientThresholds.clear();
        this.indexQuarterlyQuotientThresholds.addAll(indexQuarterlyQuotientThresholds);
    }


    public void updateStandardYearQuarterCode(String standardYearQuarterCode) {
        this.standardYearQuarterCode = standardYearQuarterCode;
    }
}
