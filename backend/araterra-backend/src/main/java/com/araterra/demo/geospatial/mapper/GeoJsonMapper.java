package com.araterra.demo.geospatial.mapper;

import com.araterra.demo.geospatial.entity.AgriculturalArea;
import com.araterra.demo.geospatial.entity.InfrastructurePoint;
import com.araterra.demo.geospatial.entity.Road;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GeoJsonMapper {

    public Map<String, Object> roadsToGeoJson(List<Road> roads) {
        List<Map<String, Object>> features = roads.stream().map(road -> {
            Map<String, Object> feature = new HashMap<>();
            feature.put("type", "Feature");
            feature.put("id", road.getId().toString());
            
            Map<String, Object> properties = new HashMap<>();
            properties.put("name", road.getName());
            properties.put("type", road.getType());
            feature.put("properties", properties);
            
            feature.put("geometry", convertLineString(road.getGeometry()));
            return feature;
        }).toList();

        Map<String, Object> featureCollection = new HashMap<>();
        featureCollection.put("type", "FeatureCollection");
        featureCollection.put("features", features);
        return featureCollection;
    }

    public Map<String, Object> agriculturalAreasToGeoJson(List<AgriculturalArea> areas) {
        List<Map<String, Object>> features = areas.stream().map(area -> {
            Map<String, Object> feature = new HashMap<>();
            feature.put("type", "Feature");
            feature.put("id", area.getId().toString());
            
            Map<String, Object> properties = new HashMap<>();
            properties.put("name", area.getName());
            properties.put("cropType", area.getCropType());
            properties.put("vegetationIndex", area.getVegetationIndex());
            feature.put("properties", properties);
            
            feature.put("geometry", convertPolygon(area.getGeometry()));
            return feature;
        }).toList();

        Map<String, Object> featureCollection = new HashMap<>();
        featureCollection.put("type", "FeatureCollection");
        featureCollection.put("features", features);
        return featureCollection;
    }

    public Map<String, Object> infrastructurePointsToGeoJson(List<InfrastructurePoint> points) {
        List<Map<String, Object>> features = points.stream().map(point -> {
            Map<String, Object> feature = new HashMap<>();
            feature.put("type", "Feature");
            feature.put("id", point.getId().toString());
            
            Map<String, Object> properties = new HashMap<>();
            properties.put("name", point.getName());
            properties.put("type", point.getType().name());
            feature.put("properties", properties);
            
            feature.put("geometry", convertPoint(point.getGeometry()));
            return feature;
        }).toList();

        Map<String, Object> featureCollection = new HashMap<>();
        featureCollection.put("type", "FeatureCollection");
        featureCollection.put("features", features);
        return featureCollection;
    }

    private Map<String, Object> convertPoint(Point point) {
        Map<String, Object> geometry = new HashMap<>();
        geometry.put("type", "Point");
        geometry.put("coordinates", List.of(point.getX(), point.getY()));
        return geometry;
    }

    private Map<String, Object> convertLineString(LineString lineString) {
        Map<String, Object> geometry = new HashMap<>();
        geometry.put("type", "LineString");
        
        List<List<Double>> coordinates = new ArrayList<>();
        for (Coordinate coord : lineString.getCoordinates()) {
            coordinates.add(List.of(coord.x, coord.y));
        }
        geometry.put("coordinates", coordinates);
        return geometry;
    }

    private Map<String, Object> convertPolygon(Polygon polygon) {
        Map<String, Object> geometry = new HashMap<>();
        geometry.put("type", "Polygon");
        
        List<List<List<Double>>> coordinates = new ArrayList<>();
        List<List<Double>> ring = new ArrayList<>();
        for (Coordinate coord : polygon.getCoordinates()) {
            ring.add(List.of(coord.x, coord.y));
        }
        coordinates.add(ring);
        geometry.put("coordinates", coordinates);
        return geometry;
    }
}
