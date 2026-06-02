package com.araterra.demo.geospatial.service;

import com.araterra.demo.AI.dtos.LocationAnalysisResponseDTO;
import com.araterra.demo.geospatial.dto.*;
import com.araterra.demo.geospatial.enums.InfrastructureType;
import com.araterra.demo.geospatial.enums.SuitabilityLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class AnalysisService {
    private static final Logger log = LoggerFactory.getLogger(AnalysisService.class);

    private static final String UNKNOWN_ROAD = "Unknown road";
    private static final String UNKNOWN_INFRASTRUCTURE = "Unknown infrastructure";
    private static final String UNKNOWN_AREA = "Unknown area";
    private static final double DEFAULT_ROAD_DISTANCE_KM = 999.0;
    private static final double DEFAULT_INFRASTRUCTURE_DISTANCE_KM = 999.0;
    private static final double RANDOM_VEGETATION_MIN = 0.35;
    private static final double RANDOM_VEGETATION_MAX = 0.85;
    private static final double DEFAULT_CONTEXT_SCORE = 50.0;
    private static final double ROAD_WEIGHT = 0.30;
    private static final double VEGETATION_WEIGHT = 0.25;
    private static final double INFRASTRUCTURE_WEIGHT = 0.25;
    private static final double BIOME_WEIGHT = 0.10;
    private static final double LOCATION_WEIGHT = 0.10;
    private static final double HIGH_SCORE_THRESHOLD = 75.0;
    private static final double MEDIUM_SCORE_THRESHOLD = 45.0;

    private final NominatimService nominatimService;

    public AnalysisService(NominatimService nominatimService) {
        this.nominatimService = nominatimService;
    }

    public QueryPointResponseDTO queryPoint(double latitude, double longitude) {
        return buildQueryPoint(latitude, longitude, null);
    }

    private QueryPointResponseDTO buildQueryPoint(double latitude, double longitude, LocationAnalysisResponseDTO aiAnalysis) {
        NominatimResponseDTO nominatim = nominatimService.reverseGeocode(latitude, longitude).orElse(null);
        CityInfoDTO cityInfo = nominatimService.extractCityInfo(aiAnalysis, nominatim).orElse(null);

        String nearestRoadName = firstNonBlank(
                nominatimService.resolveRoadName(aiAnalysis, nominatim),
                UNKNOWN_ROAD
        );
        Double distanceToRoadKm = nominatimService.resolveRoadDistanceKm(aiAnalysis, DEFAULT_ROAD_DISTANCE_KM);
        String nearestInfrastructureName = firstNonBlank(
                nominatimService.resolveInfrastructureName(aiAnalysis, nominatim, cityInfo),
                UNKNOWN_INFRASTRUCTURE
        );
        InfrastructureType nearestInfrastructureType = nominatimService.resolveInfrastructureType(aiAnalysis, nominatim);
        Double distanceToInfrastructureKm = nominatimService.resolveInfrastructureDistanceKm(aiAnalysis, DEFAULT_INFRASTRUCTURE_DISTANCE_KM);
        String areaType = firstNonBlank(
                nominatimService.resolveAreaType(aiAnalysis, nominatim),
                UNKNOWN_AREA
        );
        Double vegetationIndex = randomVegetationIndex();
        log.info("Vegetation analysis used random vegetation index for lat={}, lon={}: {}", latitude, longitude, vegetationIndex);

        return new QueryPointResponseDTO(
                latitude,
                longitude,
                nearestRoadName,
                distanceToRoadKm,
                nearestInfrastructureName,
                nearestInfrastructureType,
                distanceToInfrastructureKm,
                areaType,
                vegetationIndex
        );
    }

    public ScoreResponseDTO calculateScore(double latitude, double longitude) {
        return calculateScore(latitude, longitude, null);
    }

    public ScoreResponseDTO calculateScore(double latitude, double longitude, LocationAnalysisResponseDTO aiAnalysis) {
        QueryPointResponseDTO queryPoint = buildQueryPoint(latitude, longitude, aiAnalysis);
        double roadDistanceKm = valueOrDefault(queryPoint.distanceToRoadKm(), DEFAULT_ROAD_DISTANCE_KM);
        double infrastructureDistanceKm = valueOrDefault(queryPoint.distanceToInfrastructureKm(), DEFAULT_INFRASTRUCTURE_DISTANCE_KM);
        double vegetationIndex = valueOrDefault(queryPoint.vegetationIndex(), RANDOM_VEGETATION_MIN);

        double roadScore = calculateRoadScore(roadDistanceKm);
        double infrastructureScore = calculateInfrastructureScore(infrastructureDistanceKm);
        double vegetationScore = calculateVegetationScore(vegetationIndex);
        double biomeScore = calculateBiomeScore(aiAnalysis, queryPoint.areaType());
        double locationScore = calculateLocationScore(aiAnalysis);
        double finalScore = clampScore(
                (roadScore * ROAD_WEIGHT)
                        + (vegetationScore * VEGETATION_WEIGHT)
                        + (infrastructureScore * INFRASTRUCTURE_WEIGHT)
                        + (biomeScore * BIOME_WEIGHT)
                        + (locationScore * LOCATION_WEIGHT)
        );
        SuitabilityLevel suitabilityLevel = classifySuitability(finalScore);

        return new ScoreResponseDTO(
                roadDistanceKm,
                infrastructureDistanceKm,
                vegetationScore,
                roadScore,
                infrastructureScore,
                finalScore,
                suitabilityLevel,
                biomeScore,
                locationScore
        );
    }

    public RegionSummaryResponseDTO getRegionSummary(double latitude, double longitude, boolean generateAiInsight) {
        ScoreResponseDTO scoreResponseDTO = calculateScore(latitude, longitude);

        QueryPointResponseDTO queryResponse = queryPoint(latitude, longitude);

        return new RegionSummaryResponseDTO(
                new RegionSummaryCoordinatesDTO(latitude, longitude),
                new RegionSummaryScoreDTO(
                        scoreResponseDTO.finalScore(),
                        scoreResponseDTO.suitabilityLevel()
                ),
                new RegionSummaryCharacteristicsDTO(
                        queryResponse.nearestRoadName(),
                        queryResponse.distanceToRoadKm(),
                        queryResponse.nearestInfrastructureName(),
                        queryResponse.nearestInfrastructureType(),
                        queryResponse.distanceToInfrastructureKm(),
                        queryResponse.vegetationIndex(),
                        queryResponse.areaType()
                )
        );
    }

    private double calculateRoadScore(double distanceKm) {
        if (distanceKm <= 5) return 100.0;
        if (distanceKm <= 15) return 70.0;
        if (distanceKm <= 30) return 40.0;
        return 10.0;
    }

    private double calculateInfrastructureScore(double distanceKm) {
        if (distanceKm <= 10) return 100.0;
        if (distanceKm <= 30) return 70.0;
        if (distanceKm <= 60) return 40.0;
        return 10.0;
    }

    private double calculateVegetationScore(double vegetationIndex) {
        return clampScore(vegetationIndex * 100.0);
    }

    private double calculateBiomeScore(LocationAnalysisResponseDTO aiAnalysis, String areaType) {
        if (aiAnalysis != null && aiAnalysis.biome() != null) {
            String confidence = aiAnalysis.biome().confidence();
            if ("HIGH".equalsIgnoreCase(confidence)) {
                return 90.0;
            }
            if ("MEDIUM".equalsIgnoreCase(confidence)) {
                return 70.0;
            }
            if ("LOW".equalsIgnoreCase(confidence)) {
                return 45.0;
            }
        }

        return !isBlank(areaType) && !UNKNOWN_AREA.equals(areaType) ? 60.0 : DEFAULT_CONTEXT_SCORE;
    }

    private double calculateLocationScore(LocationAnalysisResponseDTO aiAnalysis) {
        if (aiAnalysis == null || aiAnalysis.locationContext() == null) {
            return DEFAULT_CONTEXT_SCORE;
        }

        double score = 0.0;
        if (!isBlank(aiAnalysis.locationContext().country())) {
            score += 50.0;
        }
        if (!isBlank(aiAnalysis.locationContext().region())) {
            score += 50.0;
        }
        return score;
    }

    private SuitabilityLevel classifySuitability(double finalScore) {
        if (finalScore >= HIGH_SCORE_THRESHOLD) return SuitabilityLevel.HIGH;
        if (finalScore >= MEDIUM_SCORE_THRESHOLD) return SuitabilityLevel.MEDIUM;
        return SuitabilityLevel.LOW;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (!isBlank(value)) {
                return value;
            }
        }
        return null;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private double valueOrDefault(Double value, double fallback) {
        return value != null ? value : fallback;
    }

    private double clampScore(double value) {
        return Math.max(0.0, Math.min(100.0, value));
    }

    private double randomVegetationIndex() {
        return ThreadLocalRandom.current().nextDouble(RANDOM_VEGETATION_MIN, RANDOM_VEGETATION_MAX);
    }
}
