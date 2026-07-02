package com.kodong.underscore.map.controller;


import com.kodong.underscore.auth.dto.CustomOAuth2User;
import com.kodong.underscore.map.data.request.BusinessAttractionRequest;
import com.kodong.underscore.map.data.response.BusinessAttractionResponse;
import com.kodong.underscore.map.service.ScoreApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/map")
public class ScoreApiController {

    private final ScoreApiService scoreApiService;




    @GetMapping("/serviceIndustryData")
    public ResponseEntity<Map<String,String>> getFoodServiceIndustries(){
        Map<String, String> dtos = scoreApiService.allServiceIndustryData();
        scoreApiService.updateThresholds();

        return ResponseEntity.ok().body(dtos);
    }

    @GetMapping("/business-attraction")
    public ResponseEntity<BusinessAttractionResponse> getBusinessAttraction(@RequestParam String rect,
                                                                            @RequestParam String serviceIndustryCode,
                                                                            @AuthenticationPrincipal CustomOAuth2User user){

        BusinessAttractionRequest request = parseRequest(rect,serviceIndustryCode);

        //로그인 유무로 개업 매력도 점수 넘김
        BusinessAttractionResponse response = (user != null) ?
                scoreApiService.getBusinessAttractionsForLoggedInUser(request) :
                scoreApiService.getBusinessAttractionsForGuestUser(request);

        return ResponseEntity.ok().body(response);

    }

    private BusinessAttractionRequest parseRequest(String rect, String serviceIndustryCode) {
        String[] parts = rect.split(",");

        if(parts.length !=4){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST," rect는 길이가 4여야합니다.");
        }

        double v0 = Double.parseDouble(parts[0].trim());
        double v1 = Double.parseDouble(parts[1].trim());
        double v2 = Double.parseDouble(parts[2].trim());
        double v3 = Double.parseDouble(parts[3].trim());

        double minYLatitude = Math.min(v0,v2);
        double maxYLatitude = Math.max(v0,v2);
        double minXLongitude = Math.min(v1,v3);
        double maxXLongitude = Math.max(v1,v3);

        //카카오 bounds
        BusinessAttractionRequest request = BusinessAttractionRequest
                .builder()
                .serviceIndustryCode(serviceIndustryCode)
                .minXLongitude(minXLongitude)
                .maxXLongitude(maxXLongitude)
                .minYLatitude(minYLatitude)
                .maxYLatitude(maxYLatitude)
                .build();

        return request;

    }
}
