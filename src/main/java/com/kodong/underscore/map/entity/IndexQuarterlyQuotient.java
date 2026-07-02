package com.kodong.underscore.map.entity;

import com.kodong.underscore.map.dto.IndexQuarterlyQuotientDTO;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class IndexQuarterlyQuotient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "administrative_dong_id")
    private AdministrativeDistrict administrativeDistrict;

    private String standardYearQuarterCode;
    private String tradeAreaChangeIndex;
    private String tradeAreaChangeIndexName;
    private int operatingSaleMonthAvg;
    private int closeSaleMonthAvg;
    private int seoulOperatingSaleMonthAvg;
    private int seoulCloseSaleMonthAvg;

    @Builder
    public IndexQuarterlyQuotient(AdministrativeDistrict dong, IndexQuarterlyQuotientDTO indexQ){
        this.administrativeDistrict = dong;
        this.standardYearQuarterCode = indexQ.getStandardYearQuarterCode();
        this.tradeAreaChangeIndex = indexQ.getTradeAreaChangeIndex();
        this.tradeAreaChangeIndexName = indexQ.getTradeAreaChangeIndexName();
        this.operatingSaleMonthAvg = indexQ.getOperatingSaleMonthAvg();
        this.closeSaleMonthAvg = indexQ.getCloseSaleMonthAvg();
        this.seoulOperatingSaleMonthAvg = indexQ.getSeoulOperatingSaleMonthAvg();
        this.seoulCloseSaleMonthAvg = indexQ.getSeoulCloseSaleMonthAvg();
    }
}
