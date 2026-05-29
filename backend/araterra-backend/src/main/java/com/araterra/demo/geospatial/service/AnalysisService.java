package com.araterra.demo.geospatial.service;

import com.araterra.demo.geospatial.dto.*;
import com.araterra.demo.geospatial.enums.InfrastructureType;
import com.araterra.demo.geospatial.enums.SuitabilityLevel;
import org.springframework.stereotype.Service;

@Service
public class AnalysisService {
    private static final String UNKNOWN_ROAD = "Unknown road";
    private static final String UNKNOWN_INFRASTRUCTURE = "Unknown infrastructure";
    private static final String UNKNOWN_AREA = "Unknown area";

    private final NominatimService nominatimService;

    public AnalysisService(NominatimService nominatimService) {
        this.nominatimService = nominatimService;
    }

    public QueryPointResponseDTO queryPoint(double latitude, double longitude) {
        NominatimResponseDTO nominatim = nominatimService.reverseGeocode(latitude, longitude).orElse(null);

        String nearestRoadName = firstNonBlank(
                nominatimRoadName(nominatim),
                UNKNOWN_ROAD
        );
        String nearestInfrastructureName = firstNonBlank(
                nominatimInfrastructureName(nominatim, nominatim != null ? nominatimService.extractCityInfo(nominatim).orElse(null) : null),
                UNKNOWN_INFRASTRUCTURE
        );
        InfrastructureType nearestInfrastructureType = nominatimInfrastructureType(nominatim);
        String areaType = firstNonBlank(
                nominatimAreaType(nominatim),
                UNKNOWN_AREA
        );
        Double distanceToRoadKm = 0.0;
        Double distanceToInfrastructureKm = 0.0;
        Double vegetationIndex = 0.4;

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
        QueryPointResponseDTO queryPoint = queryPoint(latitude, longitude);
        double roadDistanceKm = queryPoint.distanceToRoadKm() != null ? queryPoint.distanceToRoadKm() : 0.0;
        double infrastructureDistanceKm = queryPoint.distanceToInfrastructureKm() != null ? queryPoint.distanceToInfrastructureKm() : 0.0;
        double vegetationScore = queryPoint.vegetationIndex() != null ? queryPoint.vegetationIndex() : 0.4;

        double roadScore = calculateRoadScore(roadDistanceKm);
        double infrastructureScore = calculateInfrastructureScore(infrastructureDistanceKm);
        double finalScore = (roadScore * 0.4) + (vegetationScore * 0.3) + (infrastructureScore * 0.3);
        SuitabilityLevel suitabilityLevel = classifySuitability(finalScore);

        return new ScoreResponseDTO(
                roadDistanceKm,
                infrastructureDistanceKm,
                vegetationScore,
                roadScore,
                infrastructureScore,
                finalScore,
                suitabilityLevel
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
        if (distanceKm <= 5) return 1.0;
        if (distanceKm <= 15) return 0.7;
        if (distanceKm <= 30) return 0.4;
        return 0.1;
    }

    private double calculateInfrastructureScore(double distanceKm) {
        if (distanceKm <= 10) return 1.0;
        if (distanceKm <= 30) return 0.7;
        if (distanceKm <= 60) return 0.4;
        return 0.1;
    }

    private SuitabilityLevel classifySuitability(double finalScore) {
        if (finalScore >= 0.75) return SuitabilityLevel.HIGH;
        if (finalScore >= 0.45) return SuitabilityLevel.MEDIUM;
        return SuitabilityLevel.LOW;
    }

    private String nominatimRoadName(NominatimResponseDTO response) {
        if (response == null) {
            return null;
        }

        NominatimAddressDTO address = response.address();
        return firstNonBlank(
                address != null ? address.road() : null,
                response.display_name(),
                response.name()
        );
    }

    private String nominatimInfrastructureName(NominatimResponseDTO response, CityInfoDTO cityInfo) {
        // If we have enriched city info from Nominatim and the infrastructure type is CITY, return enriched format
        if (cityInfo != null && nominatimInfrastructureType(response) == InfrastructureType.CITY) {
            return String.format("%s, %s • %s", cityInfo.cityName(), cityInfo.state(), cityInfo.country());
        }

        if (response == null) {
            return null;
        }

        NominatimAddressDTO address = response.address();
        return firstNonBlank(
                response.name(),
                address != null ? address.railway() : null,
                address != null ? address.city() : null
        );
    }

    private InfrastructureType nominatimInfrastructureType(NominatimResponseDTO response) {
        if (response == null || response.nominatimClass() == null) {
            return InfrastructureType.CITY;
        }

        return switch (response.nominatimClass()) {
            case "railway" -> InfrastructureType.LOGISTIC_CENTER;
            case "power" -> InfrastructureType.SUBSTATION;
            case "place" -> InfrastructureType.CITY;
            default -> InfrastructureType.CITY;
        };
    }

    private String nominatimAreaType(NominatimResponseDTO response) {
        if (response == null) {
            return null;
        }

        NominatimAddressDTO address = response.address();
        String location = firstNonBlank(
                address != null ? address.city() : null,
                address != null ? address.suburb() : null,
                address != null ? address.state() : null
        );
        String category = buildCategory(response.nominatimClass(), response.type());

        if (location != null && category != null) {
            return location + " - " + category;
        }

        return firstNonBlank(location, category);
    }

    private String buildCategory(String nominatimClass, String type) {
        if (isBlank(nominatimClass) && isBlank(type)) {
            return null;
        }
        if (isBlank(nominatimClass)) {
            return type;
        }
        if (isBlank(type)) {
            return nominatimClass;
        }
        return nominatimClass + "/" + type;
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
}
