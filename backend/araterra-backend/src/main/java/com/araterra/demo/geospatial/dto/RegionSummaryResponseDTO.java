package com.araterra.demo.geospatial.dto;

public record RegionSummaryResponseDTO(
        RegionSummaryCoordinatesDTO coordinates,
        RegionSummaryScoreDTO score,
        RegionSummaryCharacteristicsDTO characteristics
) {
}
