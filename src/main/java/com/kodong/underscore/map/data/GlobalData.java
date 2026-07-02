package com.kodong.underscore.map.data;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Getter
@Component
public class GlobalData {
    private String tokenForSGIS;


    public void updateTokenForSGIS(String tokenForSGIS){
        this.tokenForSGIS = tokenForSGIS;
    }
}




