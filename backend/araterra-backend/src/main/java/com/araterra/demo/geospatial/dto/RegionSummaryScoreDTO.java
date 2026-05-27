package com.araterra.demo.geospatial.dto;

import com.araterra.demo.geospatial.enums.SuitabilityLevel;

public record RegionSummaryScoreDTO(
        Double finalScore,
        SuitabilityLevel suitabilityLevel
) {
}
