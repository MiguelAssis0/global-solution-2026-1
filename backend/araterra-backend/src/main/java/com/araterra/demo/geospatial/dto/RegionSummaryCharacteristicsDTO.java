package com.araterra.demo.geospatial.dto;

import com.araterra.demo.geospatial.enums.InfrastructureType;

public record RegionSummaryCharacteristicsDTO(
        String nearestRoadName,
        Double nearestRoadDistanceKm,
        String nearestInfrastructureName,
        InfrastructureType nearestInfrastructureType,
        Double nearestInfrastructureDistanceKm,
        Double vegetationScore,
        String areaType
) {
}
