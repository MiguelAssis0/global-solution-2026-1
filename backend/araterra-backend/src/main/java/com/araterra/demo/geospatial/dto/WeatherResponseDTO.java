package com.araterra.demo.geospatial.dto;

public record WeatherResponseDTO(
        Double temperature,
        Integer humidity,
        Double windSpeed,
        Double precipitation,
        Double weeklyRain
) {
}
