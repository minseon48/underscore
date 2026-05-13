package com.kodong.underscore.map.data.SGIS;

import com.kodong.underscore.map.data.GlobalData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Slf4j
@RequiredArgsConstructor
@Component
public class AdministrativeDistrictLocationMaker {

    private final GlobalData globalData;

    @Value("spring.sgis.consumer-key")
    private String consumerKey;

    @Value("spring.sgis.consumer-secret")
    private String consumerSecret;


    public void refreshSGISAccessToken(){
        RestClient restClient = RestClient.builder().build();

        Response<SGISTokenResult> response = restClient.get()
                .uri(tokenUriMaker())
                .retrieve()
                .body(new ParameterizedTypeReference<>(){});

        if(response.getSgisResult() == null){
            log.info("SGIS Token 요청 결과 NULL입니다.");
        }

        globalData.updateTokenForSGIS(response.getSgisResult().getAccessToken());

    }


    public AddressToLocationDTO getLocation(String address){
        RestClient restClient = RestClient.builder().build();

        Response<SGISLocationResult> response = restClient.get()
                .uri(uriMaker(globalData.getTokenForSGIS(), address))
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (response != null && response.getSgisResult() != null) {
            if (response.getSgisResult().getResultData() == null) {
                log.info("{} 이 주소의 결과가 NULL 입니다.", address);
                return null;
            }
        } else {
            log.warn("Response 또는 SgisResult가 NULL 입니다. 처리할 수 없습니다. 주소: {}", address);
            return null;
        }

        if(response.getSgisResult().getResultData().size()>1){
            log.info("{} 이 주소의 결과가 여러 개 입니다.", address);
        }


        AddressToLocationDTO addressToLocationDTO = response.getSgisResult().getResultData().get(0);


        return addressToLocationDTO;
    }


    public URI tokenUriMaker(){
        return UriComponentsBuilder
                .fromUriString("https://sgisapi.mods.go.kr/OpenAPI3/auth/authentication.json")
                .queryParam("consumer_key",consumerKey)
                .queryParam("consumer_secret",consumerSecret)
                .build()
                .toUri();
    }

    public URI uriMaker(String accessToken, String address){
        return UriComponentsBuilder
                .fromUriString("https://sgisapi.mods.go.kr/OpenAPI3/addr/geocodewgs84.json")
                .queryParam("accessToken",accessToken)
                .queryParam("address",address)
                .build()
                .toUri();
    }
}
