package com.kodong.underscore.map.data;

import org.springframework.stereotype.Component;

@Component
public class SgisAccessTokenHolder {
    private String tokenForSGIS;


    public String getTokenForSGIS() {
        return tokenForSGIS;
    }



    public void updateTokenForSGIS(String tokenForSGIS){
        this.tokenForSGIS = tokenForSGIS;
    }
}




