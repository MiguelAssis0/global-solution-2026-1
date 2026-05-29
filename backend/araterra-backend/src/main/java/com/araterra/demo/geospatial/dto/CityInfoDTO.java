package com.araterra.demo.geospatial.dto;

/**
 * Enriched city information extracted from Nominatim reverse geocoding
 */
public record CityInfoDTO(
        String name,
        String cityName,
        String state,
        String country,
        Double latitude,
        Double longitude,
        String displayName
) {
}
