package com.araterra.demo.geospatial.service;

import com.araterra.demo.geospatial.dto.WeatherResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    @Value("${weather.api.key:}")
    private String apiKey;

    private static final String CURRENT_URL =
            "https://api.openweathermap.org/data/2.5/weather" +
                    "?lat=%f&lon=%f&appid=%s&units=metric";

    private static final String FORECAST_URL =
            "https://api.openweathermap.org/data/2.5/forecast" +
                    "?lat=%f&lon=%f&appid=%s&units=metric&cnt=40";

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherResponseDTO getWeather(double lat, double lng) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("Weather API key not configured.");
        }

        try {
            String currentUrl = String.format(CURRENT_URL, lat, lng, apiKey);
            Map<String, Object> current = restTemplate.getForObject(currentUrl, Map.class);

            Map<String, Object> main = (Map<String, Object>) current.get("main");
            Map<String, Object> wind = (Map<String, Object>) current.get("wind");
            Map<String, Object> rain = (Map<String, Object>) current.get("rain");

            double temperature   = extractDouble(main, "temp");
            int    humidity      = extractInt(main, "humidity");
            double windSpeed     = extractDouble(wind, "speed");
            double precipitation = extractDouble(rain, "1h");

            String forecastUrl = String.format(FORECAST_URL, lat, lng, apiKey);
            Map<String, Object> forecast = restTemplate.getForObject(forecastUrl, Map.class);

            double weeklyRain = 0.0;
            if (forecast != null) {
                List<Map<String, Object>> list =
                        (List<Map<String, Object>>) forecast.get("list");
                if (list != null) {
                    for (Map<String, Object> entry : list) {
                        Map<String, Object> entryRain =
                                (Map<String, Object>) entry.get("rain");
                        weeklyRain += extractDouble(entryRain, "3h");
                    }
                }
            }

            return new WeatherResponseDTO(
                    temperature, humidity, windSpeed, precipitation, weeklyRain
            );

        } catch (HttpClientErrorException e) {
            throw new RuntimeException(
                    "Weather API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e
            );
        }
    }

    private double extractDouble(Map<String, Object> map, String key) {
        if (map == null) return 0.0;
        Object val = map.get(key);
        return val instanceof Number ? ((Number) val).doubleValue() : 0.0;
    }

    private int extractInt(Map<String, Object> map, String key) {
        if (map == null) return 0;
        Object val = map.get(key);
        return val instanceof Number ? ((Number) val).intValue() : 0;
    }
}