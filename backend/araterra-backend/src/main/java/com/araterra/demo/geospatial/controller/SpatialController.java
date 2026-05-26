package com.araterra.demo.geospatial.controller;

import com.araterra.demo.geospatial.enums.InfrastructureType;
import com.araterra.demo.geospatial.service.SpatialLayerService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/spatial")
public class SpatialController {

    private final SpatialLayerService spatialLayerService;

    public SpatialController(SpatialLayerService spatialLayerService) {
        this.spatialLayerService = spatialLayerService;
    }

    @GetMapping("/roads")
    public Map<String, Object> getRoads() {
        return spatialLayerService.getRoadsAsGeoJson();
    }

    @GetMapping("/agricultural-areas")
    public Map<String, Object> getAgriculturalAreas() {
        return spatialLayerService.getAgriculturalAreasAsGeoJson();
    }

    @GetMapping("/infrastructure")
    public Map<String, Object> getInfrastructure(@RequestParam(required = false) InfrastructureType type) {
        return spatialLayerService.getInfrastructureAsGeoJson(type);
    }
}
