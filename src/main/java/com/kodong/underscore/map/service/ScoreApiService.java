package com.kodong.underscore.map.service;

import com.kodong.underscore.map.data.BusinessAttractionScoringContext;
import com.kodong.underscore.map.data.request.BusinessAttractionRequest;
import com.kodong.underscore.map.data.response.BusinessAttractionResponse;
import com.kodong.underscore.map.dto.BusinessAttractionDTO;
import com.kodong.underscore.map.entity.*;
import com.kodong.underscore.map.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScoreApiService {

    private final AdministrativeDistrictRepository administrativeDistrictRepository;
    private final BusinessAttractionRepository businessAttractionRepository;
    private final ServiceIndustryRepository serviceIndustryRepository;
    private final BusinessAttractionScoringContext businessAttractionScoringContext;
    private final StoreRepository storeRepository;
    private final SellingRepository sellingRepository;
    private final ResidentPopulationRepository residentPopulationRepository;
    private final IncomeConsumptionRepository incomeConsumptionRepository;
    private final FloatingPopulationRepository floatingPopulationRepository;

    //서비스 업종 코드, 업종명 map으로 묶기
    public Map<String,String> allServiceIndustryData(){
        Map<String,String> serviceDtos = new LinkedHashMap<>();

        Sort sort = Sort.by(Sort.Direction.ASC,"serviceIndustryCode");

        List<ServiceIndustry> serviceIndustryList = serviceIndustryRepository.findByServiceIndustryCodeContaining("cs100", sort);

        for(ServiceIndustry data : serviceIndustryList){
            serviceDtos.put(data.getServiceIndustryCode(),data.getServiceIndustryName());
        }

        return serviceDtos;
    }

    public void putAllServiceIndustryDataInScoringContext(){
        businessAttractionScoringContext.updateServiceIndustryList(serviceIndustryRepository.findAll());
    }


    /* 식품 관련 서비스 업종분야만 추가하는 메서드*/
    public List<ServiceIndustry> putFoodDataIntoScoringContext(){
        Sort sort = Sort.by(Sort.Direction.ASC, "serviceIndustryCode"); // 오름차순 정렬
        List<ServiceIndustry> serviceIndustryList = serviceIndustryRepository.findByServiceIndustryCodeContaining("cs100", sort);

        businessAttractionScoringContext.updateServiceIndustryList(serviceIndustryList);

        return serviceIndustryList;
    }


    public void updateThresholds(){
        List<ServiceIndustry> serviceIndustryList = putFoodDataIntoScoringContext();


        updateFloatingPopulationThresholds();
        updateIncomeConsumptionThresholds();
        updateResidentPopulationThresholds();
        updateSellingThresholds(serviceIndustryList);
        updateStoreThresholds(serviceIndustryList);


    }


    /*파라미터로 넘어온 업종분야 별로 점포 기준 점수 수정*/
    private void updateStoreThresholds(List<ServiceIndustry> serviceIndustryList){
        Map<String, List<Integer>> storeThresholdsByIndustryCode = new HashMap<>();

        List<Store> storeData;
        List<Integer> thresholds;

        int num = 0;

        for(ServiceIndustry serviceIndustry : serviceIndustryList){
            storeData = storeRepository.findAllByServiceIndustryAndStandardYearQuarterCodeOrderBySimilarIndustryStoreCount(serviceIndustry, businessAttractionScoringContext.getStandardYearQuarterCode());
            thresholds = new ArrayList<>();

            if(storeData.isEmpty()){
                log.info("현재 이 Store Data는 비어 있습니다. (코드 : "+serviceIndustry.getServiceIndustryCode()+", 연분기 코드 : "+businessAttractionScoringContext.getStandardYearQuarterCode());
            }

            for(int i = 1; i < 3; i++){
                num = storeData.get(i*(storeData.size()/4)).getSimilarIndustryStoreCount();
                thresholds.add(num);
            }

            storeThresholdsByIndustryCode.put(serviceIndustry.getServiceIndustryCode(),thresholds);
        }

        businessAttractionScoringContext.updateStoreThresholds(storeThresholdsByIndustryCode);
    }


    /*매개변수로 넘어온 업종분야 별로 매출 점수 기준 수정*/
    private void updateSellingThresholds(List<ServiceIndustry> serviceIndustryList){
        Map<String,List<Long>> sellingThresholdsByIndustryCode = new HashMap<>();

        List<Selling> sellingData;
        List<Long> thresholds;

        long num = 0;

        for(ServiceIndustry serviceIndustry : serviceIndustryList){
            sellingData = sellingRepository
                    .findAllByServiceIndustryAndStandardYearQuarterCodeOrderByThisMonthSellingAmt(serviceIndustry,businessAttractionScoringContext.getStandardYearQuarterCode());

            thresholds = new ArrayList<>();

            if(sellingData.isEmpty()){
                log.info("현재 이 selling Data는 비어 있습니다. (코드 : "+serviceIndustry.getServiceIndustryCode()+", 연분기 코드 : "+businessAttractionScoringContext.getStandardYearQuarterCode());
                continue;
            }
            for(int i = 1 ; i < 4 ; i++){
                num = sellingData.get(i*(sellingData.size()/4)).getThisMonthSellingAmt().longValue();
                thresholds.add(num);
            }
            sellingThresholdsByIndustryCode.put(serviceIndustry.getServiceIndustryCode(),thresholds);

        }

        businessAttractionScoringContext.updateSellingThresholds(sellingThresholdsByIndustryCode);
    }


    /*상주인구 점수 기준 수정*/
    private void updateResidentPopulationThresholds(){
        List<ResidentPopulation> residentData = residentPopulationRepository
                                                .findAllByStandardYearQuarterCodeOrderByTotalRepopCountAsc(businessAttractionScoringContext.getStandardYearQuarterCode());

        List<Integer> thresholds = new ArrayList<>();

        int num = 0;

        for(int i = 1; i < 4; i++){
            num = residentData.get(i+(residentData.size()/4)).getTotalRepopCount();
            thresholds.add(num);
        }
        businessAttractionScoringContext.updateResidentPopulationThresholds(thresholds);
    }


    /*소득소비 점수 기준 수정*/
    private void updateIncomeConsumptionThresholds(){
        List<IncomeConsumption> incomeConsumptionData = incomeConsumptionRepository.findAllByStandardYearQuarterCodeOrderByFoodExpenditureAmountAsc(businessAttractionScoringContext.getStandardYearQuarterCode());
        List<Long> thresholds = new ArrayList<>();

        long num = 0;

        for(int i = 1; i < 3; i++){
            num = incomeConsumptionData.get(i*(incomeConsumptionData.size()/3)).getFoodExpenditureAmount().longValue();
            thresholds.add(num);
        }
        businessAttractionScoringContext.updateIncomeConsumptionThresholds(thresholds);
    }

    /*유동인구 점수 기준 수정*/
    private void updateFloatingPopulationThresholds(){
        List<FloatingPopulation> floatingPopulationData = floatingPopulationRepository.findAllByStandardYearQuarterCodeOrderByTotFlpopCoAsc(businessAttractionScoringContext.getStandardYearQuarterCode());
        List<Integer> thresholds = new ArrayList<>();

        int num = 0;

        for(int i = 1; i < 3; i++){
            num = floatingPopulationData.get(i*(floatingPopulationData.size()/3)).getTotFlpopCo();
            thresholds.add(num);
        }

        businessAttractionScoringContext.updateFloatingPopulationThresholds(thresholds);

    }


    /*로그인한 사용자가 점수 요청할 경우 모든 점수 넘겨주는 메서드
    * 총 개업 매력도 개수, 서비스 가능 지역 포함 여부 등이 포함됨 */

    public BusinessAttractionResponse getBusinessAttractionsForLoggedInUser(BusinessAttractionRequest businessAttractionRequest){
        List<ServiceIndustry> serviceIndustryList = putFoodDataIntoScoringContext();
        List<AdministrativeDistrict> administrativeDistrictInRange = getAdministrativeDistrictInRange(businessAttractionRequest);

        //20개 이상일 경우 에러 처리 추가 필요

        boolean containsUnServiceableArea = checkContainsUnserviceableArea(administrativeDistrictInRange);
        String[] labels = BusinessAttractionLabels.getLabels();

        String serviceIndustryCode = businessAttractionRequest.getServiceIndustryCode();


        ServiceIndustry serviceIndustry = serviceIndustryRepository.findByServiceIndustryCode(serviceIndustryCode).orElseThrow();

        List<AdministrativeDistrict> administrativeDistrictsInSeoul = getAdministrativeDistrictsInServiceArea(administrativeDistrictInRange);

        List<BusinessAttractionDTO> businessAttractionDTOS = new ArrayList<>();

        for(AdministrativeDistrict administrativeDistrict : administrativeDistrictsInSeoul){
            BusinessAttractionDTO businessAttractionDTO = makeBusinessAttractionDTOForLoggedInUser(serviceIndustry, administrativeDistrict);
            if (businessAttractionDTO != null) {
                businessAttractionDTOS.add(businessAttractionDTO);
            }
        }


        return BusinessAttractionResponse.builder()
                .count(businessAttractionDTOS.size())
                .includesUnserviceableAreas(containsUnServiceableArea)
                .labels(labels)
                .businessAttractions(businessAttractionDTOS)
                .build();
    }


    /*업종분야 객체와 행정동 객체를 받아서 처리 후 개업 매력도 DTO 생성
    * 전체 개업 매력도 점수를 모두 다 포함*/

    private BusinessAttractionDTO makeBusinessAttractionDTOForLoggedInUser(ServiceIndustry serviceIndustry, AdministrativeDistrict administrativeDistrict){
        BusinessAttractionId id = BusinessAttractionId.builder()
                .serviceIndustryId(serviceIndustry)
                .administrativeDistrictId(administrativeDistrict)
                .standardYearQuarterCode(businessAttractionScoringContext.getStandardYearQuarterCode())
                .build();

        Optional<BusinessAttraction> businessAttraction = businessAttractionRepository.findById(id);
        if (businessAttraction.isEmpty()) {
            return null;
        }

        return BusinessAttractionDTO.builder()
                .administrativeCode(administrativeDistrict.getAdministrativeCode())
                .administrativeDistrictName(administrativeDistrict.getFullAddress())
                .businessAttractionScores(businessAttraction.get().getScoresForLoggedInUser())
                .totalScore(businessAttraction.get().getTotalScore())
                .coordinates(BusinessAttractionDTO.Coordinates.builder()
                        .latitude(administrativeDistrict.getYLatitude())
                        .longitude(administrativeDistrict.getXLongitude())
                        .build())
                .build();
    }

    /*로그인하지 않은 게스트 사용자가 점수 요청할 경우 모든 점수 넘겨주는 메서드
    * 개업 매력도 점수가 담긴 Response를 만드는 메서드*/

    public BusinessAttractionResponse getBusinessAttractionsForGuestUser(BusinessAttractionRequest businessAttractionRequest){
        putFoodDataIntoScoringContext();

        List<AdministrativeDistrict> administrativeDistrictInRange = getAdministrativeDistrictInRange(businessAttractionRequest);

        //20개 이상일 경우 에러 처리 추가 필요

        boolean containsUnserviceableArea = checkContainsUnserviceableArea(administrativeDistrictInRange);

        String[] labels = BusinessAttractionLabels.getLabels();

        //유효성 검사 필요

        ServiceIndustry serviceIndustry = serviceIndustryRepository.findByServiceIndustryCode(businessAttractionRequest.getServiceIndustryCode()).orElseThrow();

        List<AdministrativeDistrict> administrativeDistrictsInSeoul = getAdministrativeDistrictsInServiceArea(administrativeDistrictInRange);

        List<BusinessAttractionDTO> businessAttractionDTOS = new ArrayList<>();

        for(AdministrativeDistrict administrativeDistrict : administrativeDistrictsInSeoul){
            BusinessAttractionDTO businessAttractionDTO = makeBusinessAttractionDTOForGuestUser(serviceIndustry, administrativeDistrict);
            if (businessAttractionDTO != null) {
                businessAttractionDTOS.add(businessAttractionDTO);
            }
        }

        return BusinessAttractionResponse.builder()
                .count(businessAttractionDTOS.size())
                .includesUnserviceableAreas(containsUnserviceableArea)
                .labels(labels)
                .businessAttractions(businessAttractionDTOS)
                .build();

    }

    /*업종 분야 객체와 행정동 객체를 받아서 처리 후 개업 매력도 DTO 생성
    * 로그인 하지 않은 유저에게 제공하는 개업 매력도 DTO 생성*/
    private BusinessAttractionDTO makeBusinessAttractionDTOForGuestUser(ServiceIndustry serviceIndustry, AdministrativeDistrict administrativeDistrict) {

        BusinessAttractionId id = BusinessAttractionId.builder()
                .serviceIndustryId(serviceIndustry)
                .administrativeDistrictId(administrativeDistrict)
                .standardYearQuarterCode(businessAttractionScoringContext.getStandardYearQuarterCode())
                .build();

        Optional<BusinessAttraction> businessAttraction = businessAttractionRepository.findById(id);
        if (businessAttraction.isEmpty()) {
            return null;
        }

        int[] scores = businessAttraction.get().getScoresForGuestUser();
        int sum = Arrays.stream(scores).sum();

        return BusinessAttractionDTO.builder()
                .administrativeCode(administrativeDistrict.getAdministrativeCode())
                .administrativeDistrictName(administrativeDistrict.getFullAddress())
                .businessAttractionScores(scores)
                .totalScore(sum)
                .coordinates(BusinessAttractionDTO.Coordinates.builder()
                        .latitude(administrativeDistrict.getYLatitude())
                        .longitude(administrativeDistrict.getXLongitude())
                        .build())
                .build();
    }

        /**
     * 지도 범위 내 행정동 목록에서 서울(행정코드 11로 시작)만 필터링하여 반환한다.
     * 개업 매력도 점수 조회 대상 행정동 목록으로 사용한다.
     */
    private List<AdministrativeDistrict> getAdministrativeDistrictsInServiceArea(List<AdministrativeDistrict> districts){
        List<AdministrativeDistrict> districtsInServiceArea = new ArrayList<>();

        for(AdministrativeDistrict district : districts){
            if(!district.getAdministrativeCode().startsWith("11")) continue;
            districtsInServiceArea.add(district);
        }

        return districtsInServiceArea;
    }


    /**
     * 클라이언트로부터 지도의 범위를 받았을 때 그 범위 내에 포함된 행정동 list 반환
     * @param requestData 지도의 범위가 담긴 DTO
     * @return 범위 내에 포함된 행정동 List
     */
    private List<AdministrativeDistrict> getAdministrativeDistrictInRange(BusinessAttractionRequest requestData) {
        List<AdministrativeDistrict> districtsInRange =  administrativeDistrictRepository.findByXLongitudeBetweenAndYLatitudeBetween(
                requestData.getMinXLongitude(),
                requestData.getMaxXLongitude(),
                requestData.getMinYLatitude(),
                requestData.getMaxYLatitude()
        );
        return districtsInRange;
    }


    /*서비스 불가 지역을 포함하고 있는지 확인하는 함수
    * 현재는 서울만 제공하고 있음*/
    private boolean checkContainsUnserviceableArea(List<AdministrativeDistrict> districts){
        for(AdministrativeDistrict district : districts){
            if(!district.getAdministrativeCode().startsWith("11")){
                return true; //서비스 불가인 경우
            }
        }
        return false;//서비스 가능인 경우
    }


    /*처리 예정 : 업종 분야 코드가 정상인지 확인하는 부분
    * 빈 문자열이 넘어오면 에러 처리
    * DB에 없는 문자열이 넘어올 경우 에러처리*/



}

