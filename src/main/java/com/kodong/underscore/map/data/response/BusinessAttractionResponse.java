package com.kodong.underscore.map.data.response;

import com.kodong.underscore.map.dto.BusinessAttractionDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BusinessAttractionResponse {
    private int count;
    private boolean includesUnserviceableAreas;
    private String[] labels; // 다각형 그래프의 각 축의 제목,이름
    private List<BusinessAttractionDTO> businessAttractions;
}
