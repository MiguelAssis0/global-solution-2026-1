package com.araterra.demo.geospatial.dto;

import com.araterra.demo.geospatial.enums.InfrastructureType;
import com.araterra.demo.geospatial.enums.SuitabilityLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegionSummaryResponse {

    private Coordinates coordinates;

    private Score score;

    private Characteristics characteristics;

    private AiInsight ai;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Coordinates {
        private Double latitude;
        private Double longitude;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Score {
        private Double finalScore;
        private SuitabilityLevel suitabilityLevel;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Characteristics {
        private String nearestRoadName;
        private Double nearestRoadDistanceKm;
        private String nearestInfrastructureName;
        private InfrastructureType nearestInfrastructureType;
        private Double nearestInfrastructureDistanceKm;
        private Double vegetationScore;
        private String areaType;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiInsight {
        private String insight;
        private String recommendedUse;
    }
}
