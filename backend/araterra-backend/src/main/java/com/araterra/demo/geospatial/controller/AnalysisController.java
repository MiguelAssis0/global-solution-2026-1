package com.araterra.demo.geospatial.controller;

import com.araterra.demo.geospatial.dto.*;
import com.araterra.demo.geospatial.service.AnalysisService;
import com.araterra.demo.geospatial.service.AiInsightService;
import com.araterra.demo.geospatial.service.WeatherService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AnalysisController {

    private final AnalysisService analysisService;
    private final AiInsightService aiInsightService;
    private final WeatherService weatherService;

    public AnalysisController(AnalysisService analysisService, AiInsightService aiInsightService, WeatherService weatherService) {
        this.analysisService = analysisService;
        this.aiInsightService = aiInsightService;
        this.weatherService = weatherService;
    }

    @PostMapping("/analysis/query-point")
    public QueryPointResponse queryPoint(@Valid @RequestBody CoordinateRequest request) {
        return analysisService.queryPoint(request.getLatitude(), request.getLongitude());
    }

    @PostMapping("/analysis/calculate")
    public ScoreResponse calculateScore(@Valid @RequestBody CoordinateRequest request) {
        return analysisService.calculateScore(request.getLatitude(), request.getLongitude());
    }

    @GetMapping("/geo/weather")
    public WeatherResponse getWeather(@RequestParam double lat, @RequestParam double lng) {
        return weatherService.getWeather(lat, lng);
    }

    @PostMapping("/region-summary")
    public RegionSummaryResponse getRegionSummary(@Valid @RequestBody RegionSummaryRequest request) {
        RegionSummaryResponse response = analysisService.getRegionSummary(
            request.getLatitude(),
            request.getLongitude(),
            request.getGenerateAiInsight()
        );

        if (request.getGenerateAiInsight() && response.getScore() != null) {
            AiInsightService.AiInsightResult insight = aiInsightService.generateInsight(
                response.getCharacteristics().getNearestRoadDistanceKm(),
                response.getCharacteristics().getNearestInfrastructureDistanceKm(),
                response.getCharacteristics().getVegetationScore(),
                response.getScore().getFinalScore(),
                response.getScore().getSuitabilityLevel()
            );

            RegionSummaryResponse.AiInsight aiInsight = new RegionSummaryResponse.AiInsight();
            aiInsight.setInsight(insight.insight());
            aiInsight.setRecommendedUse(insight.recommendedUse());
            response.setAi(aiInsight);
        }

        return response;
    }
}
