package com.kodong.underscore.map.util;

public class AdministrativeCodeNormalizer {
    public static String toAdministrativeOrganizationCode(String administrativeCode){
        if(administrativeCode == null || administrativeCode.isBlank()){
            return administrativeCode;
        }

        String code = administrativeCode.trim();

        if(code.length() == 8){
            return code+"00";
        }

        return code;
    }
}
