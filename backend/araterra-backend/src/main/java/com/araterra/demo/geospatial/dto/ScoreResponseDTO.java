package com.araterra.demo.geospatial.dto;

import com.araterra.demo.geospatial.enums.SuitabilityLevel;

public record ScoreResponseDTO(
        Double distanceToRoadKm,
        Double distanceToInfrastructureKm,
        Double vegetationScore,
        Double logisticConnectivityScore,
        Double energyInfrastructureScore,
        Double finalScore,
        SuitabilityLevel suitabilityLevel
) {
}
