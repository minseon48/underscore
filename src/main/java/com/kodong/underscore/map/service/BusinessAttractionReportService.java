package com.kodong.underscore.map.service;

import com.kodong.underscore.map.data.BusinessAttractionScoringContext;
import com.kodong.underscore.map.data.GlobalData;
import com.kodong.underscore.map.data.report.*;
import com.kodong.underscore.map.data.request.BusinessAttractionRequest;
import com.kodong.underscore.map.data.response.BusinessAttractionResponse;
import com.kodong.underscore.map.entity.*;
import com.kodong.underscore.map.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;


@RequiredArgsConstructor
@Service
public class BusinessAttractionReportService {

    private final BusinessAttractionScoringContext businessAttractionScoringContext;
    private final AdministrativeDistrictRepository administrativeDistrictRepository;
    private final ServiceIndustryRepository serviceIndustryRepository;
    private final FloatingPopulationRepository floatingPopulationRepository;
    private final IncomeConsumptionRepository incomeConsumptionRepository;
    private final IndexQuarterlyQuotientRepository indexQuarterlyQuotientRepository;
    private final ResidentPopulationRepository residentPopulationRepository;
    private final BusinessAttractionRepository businessAttractionRepository;
    private final StoreRepository storeRepository;
    private final SellingRepository sellingRepository;

    public BusinessAttractionReportResponseDTO getReport(@RequestBody BusinessAttractionRequest request){
        AdministrativeDistrict administrativeDistrict = administrativeDistrictRepository.findByAdministrativeCode(request.getAdministrativeCode()).orElseThrow();
        ServiceIndustry serviceIndustry = serviceIndustryRepository.findByServiceIndustryCode(request.getServiceIndustryCode()).orElseThrow();


        BusinessAttractionId attractionId = BusinessAttractionId.builder()
                .administrativeDistrictId(administrativeDistrict)
                .serviceIndustryId(serviceIndustry)
                .standardYearQuarterCode(businessAttractionScoringContext.getStandardYearQuarterCode())
                .build();


        BusinessAttractionReportFloatingPopulationInfo floatingPopulationInfo = getFloatingPopulationInfo(administrativeDistrict);
        BusinessAttractionReportIncomeConsumptionInfo incomeConsumptionInfo = getIncomeConsumptionInfo(administrativeDistrict);
        BusinessAttractionReportIndexQuarterlyQuotientInfo indexQuarterlyQuotientInfo = getIndexQuarterlyQuotientInfo(administrativeDistrict);
        BusinessAttractionReportResidentPopulationInfo residentPopulationInfo = getResidentPopulationInfo(administrativeDistrict);

        BusinessAttraction businessAttraction = businessAttractionRepository.findById(attractionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"개업 매력도 데이터가 없습니다."));

        BusinessAttractionReportResponseDTO reportResponseDTO = BusinessAttractionReportResponseDTO.builder()
                .id(administrativeDistrict.getId())
                .address(administrativeDistrict.getFullAddress())
                .floatingPopulationInfo(floatingPopulationInfo)
                .incomeConsumptionInfo(incomeConsumptionInfo)
                .indexQuarterlyQuotientInfo(indexQuarterlyQuotientInfo)
                .reportResidentPopulationInfo(residentPopulationInfo)
                .labels(BusinessAttractionLabels.getLabels())
                .businessAttractionScores(businessAttraction.getScoresForLoggedInUser())
                .totalScore(businessAttraction.getTotalScore())
                .serviceIndustryCode(serviceIndustry.getServiceIndustryCode())
                .serviceIndustryName(serviceIndustry.getServiceIndustryName())
                .build();

        return attachStoreAndSellingInfo(reportResponseDTO,administrativeDistrict,serviceIndustry);
    }

    private BusinessAttractionReportResponseDTO attachStoreAndSellingInfo(BusinessAttractionReportResponseDTO responseDTO, AdministrativeDistrict district, ServiceIndustry serviceIndustry){
        Optional<Store> storeData =
                storeRepository.findByStandardYearQuarterCodeAndAdministrativeDistrictAndServiceIndustry(businessAttractionScoringContext.getStandardYearQuarterCode(),district,serviceIndustry);


        Optional<Selling> sellingData =
                sellingRepository.findByStandardYearQuarterCodeAndAdministrativeDistrictAndServiceIndustry(businessAttractionScoringContext.getStandardYearQuarterCode(),district,serviceIndustry);

        BusinessAttractionReportStoreInfo storeInfo;
        BusinessAttractionReportSellingInfo sellingInfo;


        if (storeData.isPresent() && sellingData.isPresent()) {
            storeInfo = BusinessAttractionReportStoreInfo.builder().store(storeData.get()).build();
            sellingInfo = BusinessAttractionReportSellingInfo.builder().selling(sellingData.get()).build();
            responseDTO.updateSellingInfo(sellingInfo);
            responseDTO.updateStoreInfo(storeInfo);
            return responseDTO;
        }

        if (sellingData.isPresent()) {
            sellingInfo = BusinessAttractionReportSellingInfo.builder().selling(sellingData.get()).build();
            responseDTO.updateSellingInfo(sellingInfo);
            responseDTO.updateErrorMessage("현재 이 지역의 해당 서비스 업종 관련 점포 데이터가 존재하지 않습니다.");
            return responseDTO;
        }

        if (storeData.isPresent()) {
            storeInfo = BusinessAttractionReportStoreInfo.builder().store(storeData.get()).build();
            responseDTO.updateStoreInfo(storeInfo);
            responseDTO.updateErrorMessage("현재 이 지역의 해당 서비스 업종 관련 매출 데이터가 존재하지 않습니다.");
            return responseDTO;
        }

        responseDTO.updateErrorMessage("현재 이 지역의 해당 서비스 업종 관련 매출, 점포 데이터가 존재하지 않습니다.");
        return responseDTO;
    }

    private BusinessAttractionReportResidentPopulationInfo getResidentPopulationInfo(AdministrativeDistrict district) {
        ResidentPopulation residentPopulationData
                = residentPopulationRepository.findByStandardYearQuarterCodeAndAdministrativeDistrict(businessAttractionScoringContext.getStandardYearQuarterCode(), district).orElseThrow();

        return BusinessAttractionReportResidentPopulationInfo
                .builder()
                .residentPopulation(residentPopulationData)
                .build();
    }

    private BusinessAttractionReportIndexQuarterlyQuotientInfo getIndexQuarterlyQuotientInfo(AdministrativeDistrict district) {
        IndexQuarterlyQuotient indexQuarterlyQuotientData
                = indexQuarterlyQuotientRepository.findByStandardYearQuarterCodeAndAdministrativeDistrict(businessAttractionScoringContext.getStandardYearQuarterCode(), district).orElseThrow();

        return BusinessAttractionReportIndexQuarterlyQuotientInfo
                .builder()
                .indexQuarterlyQuotient(indexQuarterlyQuotientData)
                .build();
    }

    private BusinessAttractionReportIncomeConsumptionInfo getIncomeConsumptionInfo(AdministrativeDistrict district) {
        IncomeConsumption incomeConsumptionData
                = incomeConsumptionRepository.findByStandardYearQuarterCodeAndAdministrativeDistrict(businessAttractionScoringContext.getStandardYearQuarterCode(), district).orElseThrow();

        return BusinessAttractionReportIncomeConsumptionInfo
                .builder()
                .incomeConsumption(incomeConsumptionData)
                .build();
    }


    private BusinessAttractionReportFloatingPopulationInfo getFloatingPopulationInfo(AdministrativeDistrict district){
        FloatingPopulation floatingPopulationData
                = floatingPopulationRepository.findByStandardYearQuarterCodeAndAdministrativeDistrict(businessAttractionScoringContext.getStandardYearQuarterCode(), district).orElseThrow();


        return BusinessAttractionReportFloatingPopulationInfo.builder()
                .floatingPopulation(floatingPopulationData)
                .build();
    }
}
