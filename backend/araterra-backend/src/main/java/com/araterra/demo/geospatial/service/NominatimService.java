package com.araterra.demo.geospatial.service;

import com.araterra.demo.geospatial.dto.CityInfoDTO;
import com.araterra.demo.geospatial.dto.NominatimAddressDTO;
import com.araterra.demo.geospatial.dto.NominatimResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Service
public class NominatimService {

    private static final Logger log = LoggerFactory.getLogger(NominatimService.class);

    private final RestClient nominatimRestClient;

    public NominatimService(RestClient nominatimRestClient) {
        this.nominatimRestClient = nominatimRestClient;
    }

    public Optional<NominatimResponseDTO> reverseGeocode(double latitude, double longitude) {
        try {
            NominatimResponseDTO response = nominatimRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/reverse")
                            .queryParam("lat", latitude)
                            .queryParam("lon", longitude)
                            .queryParam("format", "json")
                            .queryParam("zoom", "18")
                            .queryParam("addressdetails", "1")
                            .build())
                    .retrieve()
                    .body(NominatimResponseDTO.class);

            return Optional.ofNullable(response);
        } catch (Exception exception) {
            log.warn("Nominatim reverse geocoding failed for lat={}, lon={}: {}", latitude, longitude, exception.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Extracts enriched city information from Nominatim response
     */
    public Optional<CityInfoDTO> extractCityInfo(NominatimResponseDTO response) {
        if (response == null || response.address() == null) {
            return Optional.empty();
        }

        NominatimAddressDTO address = response.address();
        
        String cityName = firstNonBlank(
                address.city(),
                address.town(),
                address.village(),
                address.municipality(),
                "Unknown"
        );
        
        String state = firstNonBlank(
                address.state(),
                address.county(),
                "Unknown"
        );
        
        String country = firstNonBlank(
                address.country(),
                "Unknown"
        );

        CityInfoDTO cityInfo = new CityInfoDTO(
                response.name() != null ? response.name() : cityName,
                cityName,
                state,
                country,
                parseDouble(response.lat()),
                parseDouble(response.lon()),
                response.display_name()
        );

        return Optional.of(cityInfo);
    }

    /**
     * Gets city information for a coordinate using reverse geocoding
     */
    public Optional<CityInfoDTO> getCityFromCoordinates(double latitude, double longitude) {
        return reverseGeocode(latitude, longitude)
                .flatMap(this::extractCityInfo);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private Double parseDouble(String value) {
        try {
            return value != null ? Double.parseDouble(value) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
