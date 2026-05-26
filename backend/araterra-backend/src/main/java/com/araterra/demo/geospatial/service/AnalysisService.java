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

    public QueryPointResponse queryPoint(double latitude, double longitude) {
        QueryPointResponse response = new QueryPointResponse();
        response.setLatitude(latitude);
        response.setLongitude(longitude);

        Optional<Road> nearestRoad = roadRepository.findNearestRoad(latitude, longitude);
        if (nearestRoad.isPresent()) {
            Road road = nearestRoad.get();
            response.setNearestRoadName(road.getName());
            response.setDistanceToRoadKm(calculateDistance(latitude, longitude, road.getGeometry()));
        }

        Optional<InfrastructurePoint> nearestInfrastructure = infrastructurePointRepository.findNearestInfrastructure(latitude, longitude);
        if (nearestInfrastructure.isPresent()) {
            InfrastructurePoint infrastructure = nearestInfrastructure.get();
            response.setNearestInfrastructureName(infrastructure.getName());
            response.setNearestInfrastructureType(infrastructure.getType());
            response.setDistanceToInfrastructureKm(calculateDistance(latitude, longitude, infrastructure.getGeometry()));
        }

        Optional<AgriculturalArea> area = agriculturalAreaRepository.findAreaContainingPoint(latitude, longitude);
        if (area.isPresent()) {
            AgriculturalArea agriculturalArea = area.get();
            response.setAreaType("Agricultural Area");
            response.setVegetationIndex(agriculturalArea.getVegetationIndex());
        }

        return response;
    }

    public ScoreResponse calculateScore(double latitude, double longitude) {
        ScoreResponse response = new ScoreResponse();

        Optional<Road> nearestRoad = roadRepository.findNearestRoad(latitude, longitude);
        double roadDistanceKm = nearestRoad
            .map(road -> calculateDistance(latitude, longitude, road.getGeometry()))
            .orElse(Double.MAX_VALUE);
        response.setDistanceToRoadKm(roadDistanceKm);

        Optional<InfrastructurePoint> nearestInfrastructure = infrastructurePointRepository.findNearestInfrastructure(latitude, longitude);
        double infrastructureDistanceKm = nearestInfrastructure
            .map(infrastructure -> calculateDistance(latitude, longitude, infrastructure.getGeometry()))
            .orElse(Double.MAX_VALUE);
        response.setDistanceToInfrastructureKm(infrastructureDistanceKm);

        Optional<AgriculturalArea> area = agriculturalAreaRepository.findAreaContainingPoint(latitude, longitude);
        double vegetationScore = area
            .map(AgriculturalArea::getVegetationIndex)
            .orElse(0.4);
        response.setVegetationScore(vegetationScore);

        double roadScore = calculateRoadScore(roadDistanceKm);
        response.setLogisticConnectivityScore(roadScore);

        double infrastructureScore = calculateInfrastructureScore(infrastructureDistanceKm);
        response.setEnergyInfrastructureScore(infrastructureScore);

        double finalScore = (roadScore * 0.4) + (vegetationScore * 0.3) + (infrastructureScore * 0.3);
        response.setFinalScore(finalScore);

        SuitabilityLevel suitabilityLevel = classifySuitability(finalScore);
        response.setSuitabilityLevel(suitabilityLevel);

        return response;
    }

    public RegionSummaryResponse getRegionSummary(double latitude, double longitude, boolean generateAiInsight) {
        RegionSummaryResponse response = new RegionSummaryResponse();

        RegionSummaryResponse.Coordinates coordinates = new RegionSummaryResponse.Coordinates();
        coordinates.setLatitude(latitude);
        coordinates.setLongitude(longitude);
        response.setCoordinates(coordinates);

        ScoreResponse scoreResponse = calculateScore(latitude, longitude);
        RegionSummaryResponse.Score score = new RegionSummaryResponse.Score();
        score.setFinalScore(scoreResponse.getFinalScore());
        score.setSuitabilityLevel(scoreResponse.getSuitabilityLevel());
        response.setScore(score);

        QueryPointResponse queryResponse = queryPoint(latitude, longitude);
        RegionSummaryResponse.Characteristics characteristics = new RegionSummaryResponse.Characteristics();
        characteristics.setNearestRoadName(queryResponse.getNearestRoadName());
        characteristics.setNearestRoadDistanceKm(queryResponse.getDistanceToRoadKm());
        characteristics.setNearestInfrastructureName(queryResponse.getNearestInfrastructureName());
        characteristics.setNearestInfrastructureType(queryResponse.getNearestInfrastructureType());
        characteristics.setNearestInfrastructureDistanceKm(queryResponse.getDistanceToInfrastructureKm());
        characteristics.setVegetationScore(queryResponse.getVegetationIndex());
        characteristics.setAreaType(queryResponse.getAreaType());
        response.setCharacteristics(characteristics);

        if (generateAiInsight) {
            RegionSummaryResponse.AiInsight aiInsight = new RegionSummaryResponse.AiInsight();
            aiInsight.setInsight("A região apresenta alta aptidão por estar próxima de vias e infraestrutura relevante.");
            aiInsight.setRecommendedUse("AGRICULTURE_AND_LOGISTICS");
            response.setAi(aiInsight);
        }

        return response;
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
