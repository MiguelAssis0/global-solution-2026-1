package com.araterra.demo.geospatial.controller;

import com.araterra.demo.geospatial.dto.*;
import com.araterra.demo.geospatial.service.AnalysisService;
import com.araterra.demo.geospatial.service.WeatherService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AnalysisController {

    private final AnalysisService analysisService;
    private final WeatherService weatherService;

    public AnalysisController(AnalysisService analysisService, WeatherService weatherService) {
        this.analysisService = analysisService;
        this.weatherService = weatherService;
    }

    @PostMapping("/analysis/query-point")
    public QueryPointResponseDTO queryPoint(@Valid @RequestBody CoordinateRequestDTO request) {
        return analysisService.queryPoint(request.latitude(), request.longitude());
    }

    @PostMapping("/analysis/calculate")
    public ScoreResponseDTO calculateScore(@Valid @RequestBody ScoreRequestDTO request) {
        return analysisService.calculateScore(request.latitude(), request.longitude(), request.aiAnalysis());
    }

    @PostMapping("/analysis/score")
    public ScoreResponseDTO score(@Valid @RequestBody ScoreRequestDTO request) {
        return analysisService.calculateScore(request.latitude(), request.longitude(), request.aiAnalysis());
    }

    @GetMapping("/geo/weather")
    public WeatherResponseDTO getWeather(@RequestParam double lat, @RequestParam double lng) {
        return weatherService.getWeather(lat, lng);
    }

    @PostMapping("/region-summary")
    public RegionSummaryResponseDTO getRegionSummary(@Valid @RequestBody RegionSummaryRequestDTO request) {
        return analysisService.getRegionSummary(
            request.latitude(),
            request.longitude(),
            request.generateAiInsight()
        );
    }
}
