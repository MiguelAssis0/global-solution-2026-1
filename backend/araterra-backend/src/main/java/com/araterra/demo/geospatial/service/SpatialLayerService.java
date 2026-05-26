package com.araterra.demo.geospatial.service;

import com.araterra.demo.geospatial.config.GeoJsonMapper;
import com.araterra.demo.geospatial.entity.AgriculturalArea;
import com.araterra.demo.geospatial.entity.InfrastructurePoint;
import com.araterra.demo.geospatial.entity.Road;
import com.araterra.demo.geospatial.enums.InfrastructureType;
import com.araterra.demo.geospatial.repository.AgriculturalAreaRepository;
import com.araterra.demo.geospatial.repository.InfrastructurePointRepository;
import com.araterra.demo.geospatial.repository.RoadRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SpatialLayerService {

    private final RoadRepository roadRepository;
    private final AgriculturalAreaRepository agriculturalAreaRepository;
    private final InfrastructurePointRepository infrastructurePointRepository;
    private final GeoJsonMapper geoJsonMapper;

    public SpatialLayerService(RoadRepository roadRepository,
                               AgriculturalAreaRepository agriculturalAreaRepository,
                               InfrastructurePointRepository infrastructurePointRepository,
                               GeoJsonMapper geoJsonMapper) {
        this.roadRepository = roadRepository;
        this.agriculturalAreaRepository = agriculturalAreaRepository;
        this.infrastructurePointRepository = infrastructurePointRepository;
        this.geoJsonMapper = geoJsonMapper;
    }

    public Map<String, Object> getRoadsAsGeoJson() {
        List<Road> roads = roadRepository.findAll();
        return geoJsonMapper.roadsToGeoJson(roads);
    }

    public Map<String, Object> getAgriculturalAreasAsGeoJson() {
        List<AgriculturalArea> areas = agriculturalAreaRepository.findAll();
        return geoJsonMapper.agriculturalAreasToGeoJson(areas);
    }

    public Map<String, Object> getInfrastructureAsGeoJson(InfrastructureType type) {
        List<InfrastructurePoint> points;
        if (type != null) {
            points = infrastructurePointRepository.findByType(type);
        } else {
            points = infrastructurePointRepository.findAll();
        }
        return geoJsonMapper.infrastructurePointsToGeoJson(points);
    }
}
