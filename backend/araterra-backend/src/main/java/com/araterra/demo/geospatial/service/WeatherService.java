package com.araterra.demo.geospatial.service;

import com.araterra.demo.geospatial.dto.WeatherResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Map;

@Service
public class WeatherService {

    @Value("${weather.api.key:}")
    private String apiKey;

    @Value("${weather.api.url:https://api.openweathermap.org/data/2.5/weather}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherResponseDTO getWeather(double lat, double lng) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("Weather API key not configured. Set WEATHER_API_KEY environment variable.");
        }

        try {
            String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=metric", apiUrl, lat, lng, apiKey);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response == null) {
                throw new RuntimeException("No response from weather API");
            }

            Map<String, Object> main = (Map<String, Object>) response.get("main");
            Map<String, Object> wind = (Map<String, Object>) response.get("wind");
            Map<String, Object> rain = (Map<String, Object>) response.get("rain");

            double temperature = main != null ? ((Number) main.get("temp")).doubleValue() : 0.0;
            int humidity = main != null ? ((Number) main.get("humidity")).intValue() : 0;
            double windSpeed = wind != null ? ((Number) wind.get("speed")).doubleValue() : 0.0;
            double precipitation = rain != null ? ((Number) rain.get("1h")).doubleValue() : 0.0;
            
            // Weekly rain estimation (OpenWeatherMap doesn't provide this in current weather)
            double weeklyRain = precipitation > 0 ? precipitation * 7 : 0.0;

            return new WeatherResponseDTO(temperature, humidity, windSpeed, precipitation, weeklyRain);
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Weather API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch weather data", e);
        }
    }
}
