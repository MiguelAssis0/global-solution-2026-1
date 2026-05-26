package com.araterra.demo.geospatial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherResponse {
    private Double temperature;
    private Integer humidity;
    private Double windSpeed;
    private Double precipitation;
    private Double weeklyRain;
}
