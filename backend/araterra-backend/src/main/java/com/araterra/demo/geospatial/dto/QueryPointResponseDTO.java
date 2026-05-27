package com.araterra.demo.geospatial.dto;

import com.araterra.demo.geospatial.enums.InfrastructureType;

public record QueryPointResponseDTO(
        Double latitude,
        Double longitude,
        String nearestRoadName,
        Double distanceToRoadKm,
        String nearestInfrastructureName,
        InfrastructureType nearestInfrastructureType,
        Double distanceToInfrastructureKm,
        String areaType,
        Double vegetationIndex
) {
}
