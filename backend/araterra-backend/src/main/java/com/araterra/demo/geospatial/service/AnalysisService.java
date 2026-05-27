package com.araterra.demo.geospatial.service;

import com.araterra.demo.geospatial.dto.*;
import com.araterra.demo.geospatial.entity.AgriculturalArea;
import com.araterra.demo.geospatial.entity.InfrastructurePoint;
import com.araterra.demo.geospatial.entity.Road;
import com.araterra.demo.geospatial.enums.InfrastructureType;
import com.araterra.demo.geospatial.enums.SuitabilityLevel;
import com.araterra.demo.geospatial.repository.AgriculturalAreaRepository;
import com.araterra.demo.geospatial.repository.InfrastructurePointRepository;
import com.araterra.demo.geospatial.repository.RoadRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AnalysisService {

    private final RoadRepository roadRepository;
    private final AgriculturalAreaRepository agriculturalAreaRepository;
    private final InfrastructurePointRepository infrastructurePointRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public AnalysisService(RoadRepository roadRepository,
                           AgriculturalAreaRepository agriculturalAreaRepository,
                           InfrastructurePointRepository infrastructurePointRepository) {
        this.roadRepository = roadRepository;
        this.agriculturalAreaRepository = agriculturalAreaRepository;
        this.infrastructurePointRepository = infrastructurePointRepository;
    }

    public QueryPointResponseDTO queryPoint(double latitude, double longitude) {
        String nearestRoadName = null;
        Double distanceToRoadKm = null;
        String nearestInfrastructureName = null;
        InfrastructureType nearestInfrastructureType = null;
        Double distanceToInfrastructureKm = null;
        String areaType = null;
        Double vegetationIndex = null;

        Optional<Road> nearestRoad = roadRepository.findNearestRoad(latitude, longitude);
        if (nearestRoad.isPresent()) {
            Road road = nearestRoad.get();
            nearestRoadName = road.getName();
            distanceToRoadKm = calculateDistance(latitude, longitude, road.getGeometry());
        }

        Optional<InfrastructurePoint> nearestInfrastructure = infrastructurePointRepository.findNearestInfrastructure(latitude, longitude);
        if (nearestInfrastructure.isPresent()) {
            InfrastructurePoint infrastructure = nearestInfrastructure.get();
            nearestInfrastructureName = infrastructure.getName();
            nearestInfrastructureType = infrastructure.getType();
            distanceToInfrastructureKm = calculateDistance(latitude, longitude, infrastructure.getGeometry());
        }

        Optional<AgriculturalArea> area = agriculturalAreaRepository.findAreaContainingPoint(latitude, longitude);
        if (area.isPresent()) {
            AgriculturalArea agriculturalArea = area.get();
            areaType = "Agricultural Area";
            vegetationIndex = agriculturalArea.getVegetationIndex();
        }

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
        Optional<Road> nearestRoad = roadRepository.findNearestRoad(latitude, longitude);
        double roadDistanceKm = nearestRoad
            .map(road -> calculateDistance(latitude, longitude, road.getGeometry()))
            .orElse(Double.MAX_VALUE);

        Optional<InfrastructurePoint> nearestInfrastructure = infrastructurePointRepository.findNearestInfrastructure(latitude, longitude);
        double infrastructureDistanceKm = nearestInfrastructure
            .map(infrastructure -> calculateDistance(latitude, longitude, infrastructure.getGeometry()))
            .orElse(Double.MAX_VALUE);

        Optional<AgriculturalArea> area = agriculturalAreaRepository.findAreaContainingPoint(latitude, longitude);
        double vegetationScore = area
            .map(AgriculturalArea::getVegetationIndex)
            .orElse(0.4);

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

    private double calculateDistance(double latitude, double longitude, org.locationtech.jts.geom.Geometry geometry) {
        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
        double distanceMeters = point.distance(geometry);
        return distanceMeters / 1000.0;
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
}
