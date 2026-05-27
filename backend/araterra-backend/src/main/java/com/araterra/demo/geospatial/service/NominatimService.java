package com.araterra.demo.geospatial.service;

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
                            .build())
                    .retrieve()
                    .body(NominatimResponseDTO.class);

            return Optional.ofNullable(response);
        } catch (Exception exception) {
            log.warn("Nominatim reverse geocoding failed for lat={}, lon={}: {}", latitude, longitude, exception.getMessage());
            return Optional.empty();
        }
    }
}
