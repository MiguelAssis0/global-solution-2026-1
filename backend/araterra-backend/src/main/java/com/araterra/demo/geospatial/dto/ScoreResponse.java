package com.araterra.demo.geospatial.dto;

import com.araterra.demo.geospatial.enums.SuitabilityLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScoreResponse {

    private Double distanceToRoadKm;

    private Double distanceToInfrastructureKm;

    private Double vegetationScore;

    private Double logisticConnectivityScore;

    private Double energyInfrastructureScore;

    private Double finalScore;

    private SuitabilityLevel suitabilityLevel;
}
