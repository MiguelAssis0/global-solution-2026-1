package com.araterra.demo.geospatial.controller;

import com.araterra.demo.geospatial.dto.*;
import com.araterra.demo.geospatial.dto.WeatherResponse;
import com.araterra.demo.geospatial.service.AnalysisService;
import com.araterra.demo.geospatial.service.AiInsightService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AnalysisController {

    private final AnalysisService analysisService;
    private final AiInsightService aiInsightService;

    public AnalysisController(AnalysisService analysisService, AiInsightService aiInsightService) {
        this.analysisService = analysisService;
        this.aiInsightService = aiInsightService;
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
        double temperature = 18.0 + 10.0 * Math.sin(Math.toRadians(lat));
        int humidity = (int) Math.max(30, Math.min(95, 65 + 20 * Math.cos(Math.toRadians(lng))));
        double windSpeed = Math.max(0.5, 6.0 * Math.abs(Math.sin(Math.toRadians(lng * 2))));
        double precipitation = Math.max(0.0, 5.0 + 10.0 * Math.sin(Math.toRadians(lat * 1.5)));
        double weeklyRain = Math.max(0.0, precipitation * (0.5 + 0.5 * Math.cos(Math.toRadians(lat))));

        return new WeatherResponse(temperature, humidity, windSpeed, precipitation, weeklyRain);
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
