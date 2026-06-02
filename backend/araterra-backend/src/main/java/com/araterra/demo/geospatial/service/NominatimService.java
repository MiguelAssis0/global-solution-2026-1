package com.araterra.demo.geospatial.service;

import com.araterra.demo.AI.dtos.LocationAnalysisResponseDTO;
import com.araterra.demo.geospatial.dto.CityInfoDTO;
import com.araterra.demo.geospatial.dto.NominatimAddressDTO;
import com.araterra.demo.geospatial.dto.NominatimResponseDTO;
import com.araterra.demo.geospatial.enums.InfrastructureType;
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

    public Optional<CityInfoDTO> extractCityInfo(LocationAnalysisResponseDTO aiAnalysis, NominatimResponseDTO fallbackResponse) {
        if (aiAnalysis != null && aiAnalysis.locationContext() != null) {
            LocationAnalysisResponseDTO.LocationContextDTO location = aiAnalysis.locationContext();
            String country = firstNonBlank(location.country(), "Unknown");
            String region = firstNonBlank(location.region(), "Unknown");
            String cityName = extractCityFromDisplayName(fallbackResponse);

            return Optional.of(new CityInfoDTO(
                    cityName,
                    cityName,
                    region,
                    country,
                    aiAnalysis.input() != null ? aiAnalysis.input().latitude() : parseDouble(fallbackResponse != null ? fallbackResponse.lat() : null),
                    aiAnalysis.input() != null ? aiAnalysis.input().longitude() : parseDouble(fallbackResponse != null ? fallbackResponse.lon() : null),
                    buildDisplayName(cityName, region, country)
            ));
        }

        return extractCityInfo(fallbackResponse);
    }

    public String resolveRoadName(LocationAnalysisResponseDTO aiAnalysis, NominatimResponseDTO fallbackResponse) {
        if (aiAnalysis != null && aiAnalysis.nearestHighway() != null) {
            return firstNonBlank(aiAnalysis.nearestHighway().name(), nominatimRoadName(fallbackResponse));
        }
        return nominatimRoadName(fallbackResponse);
    }

    public Double resolveRoadDistanceKm(LocationAnalysisResponseDTO aiAnalysis, Double fallbackDistanceKm) {
        if (aiAnalysis != null && aiAnalysis.nearestHighway() != null && aiAnalysis.nearestHighway().distanceKm() != null) {
            return aiAnalysis.nearestHighway().distanceKm();
        }
        return fallbackDistanceKm;
    }

    public String resolveInfrastructureName(LocationAnalysisResponseDTO aiAnalysis, NominatimResponseDTO fallbackResponse, CityInfoDTO cityInfo) {
        if (aiAnalysis != null && aiAnalysis.nearestSubstation() != null && !isBlank(aiAnalysis.nearestSubstation().name())) {
            return aiAnalysis.nearestSubstation().name();
        }
        if (aiAnalysis != null && aiAnalysis.nearestPort() != null && !isBlank(aiAnalysis.nearestPort().name())) {
            return aiAnalysis.nearestPort().name();
        }
        return nominatimInfrastructureName(fallbackResponse, cityInfo);
    }

    public InfrastructureType resolveInfrastructureType(LocationAnalysisResponseDTO aiAnalysis, NominatimResponseDTO fallbackResponse) {
        if (aiAnalysis != null && aiAnalysis.nearestSubstation() != null && !isBlank(aiAnalysis.nearestSubstation().name())) {
            return InfrastructureType.SUBSTATION;
        }
        if (aiAnalysis != null && aiAnalysis.nearestPort() != null && !isBlank(aiAnalysis.nearestPort().name())) {
            return InfrastructureType.LOGISTIC_CENTER;
        }
        return nominatimInfrastructureType(fallbackResponse);
    }

    public Double resolveInfrastructureDistanceKm(LocationAnalysisResponseDTO aiAnalysis, Double fallbackDistanceKm) {
        if (aiAnalysis != null && aiAnalysis.nearestSubstation() != null && aiAnalysis.nearestSubstation().distanceKm() != null) {
            return aiAnalysis.nearestSubstation().distanceKm();
        }
        if (aiAnalysis != null && aiAnalysis.nearestPort() != null && aiAnalysis.nearestPort().distanceKm() != null) {
            return aiAnalysis.nearestPort().distanceKm();
        }
        return fallbackDistanceKm;
    }

    public String resolveAreaType(LocationAnalysisResponseDTO aiAnalysis, NominatimResponseDTO fallbackResponse) {
        if (aiAnalysis != null && aiAnalysis.biome() != null) {
            String biomeName = aiAnalysis.biome().name();
            String category = aiAnalysis.biome().category();
            if (!isBlank(biomeName) && !isBlank(category)) {
                return biomeName + " - " + category;
            }
            return firstNonBlank(biomeName, category, nominatimAreaType(fallbackResponse));
        }
        return nominatimAreaType(fallbackResponse);
    }

    /**
     * Gets city information for a coordinate using reverse geocoding
     */
    public Optional<CityInfoDTO> getCityFromCoordinates(double latitude, double longitude) {
        return reverseGeocode(latitude, longitude)
                .flatMap(this::extractCityInfo);
    }

    private String nominatimRoadName(NominatimResponseDTO response) {
        if (response == null) {
            return null;
        }

        NominatimAddressDTO address = response.address();
        return firstNonBlank(
                address != null ? address.road() : null,
                response.display_name(),
                response.name()
        );
    }

    private String nominatimInfrastructureName(NominatimResponseDTO response, CityInfoDTO cityInfo) {
        if (cityInfo != null && nominatimInfrastructureType(response) == InfrastructureType.CITY) {
            return String.format("%s, %s • %s", cityInfo.cityName(), cityInfo.state(), cityInfo.country());
        }

        if (response == null) {
            return null;
        }

        NominatimAddressDTO address = response.address();
        return firstNonBlank(
                response.name(),
                address != null ? address.railway() : null,
                address != null ? address.city() : null
        );
    }

    private InfrastructureType nominatimInfrastructureType(NominatimResponseDTO response) {
        if (response == null || response.nominatimClass() == null) {
            return InfrastructureType.CITY;
        }

        return switch (response.nominatimClass()) {
            case "railway" -> InfrastructureType.LOGISTIC_CENTER;
            case "power" -> InfrastructureType.SUBSTATION;
            case "place" -> InfrastructureType.CITY;
            default -> InfrastructureType.CITY;
        };
    }

    private String nominatimAreaType(NominatimResponseDTO response) {
        if (response == null) {
            return null;
        }

        NominatimAddressDTO address = response.address();
        String location = firstNonBlank(
                address != null ? address.city() : null,
                address != null ? address.suburb() : null,
                address != null ? address.state() : null
        );
        String category = buildCategory(response.nominatimClass(), response.type());

        if (location != null && category != null) {
            return location + " - " + category;
        }

        return firstNonBlank(location, category);
    }

    private String buildCategory(String nominatimClass, String type) {
        if (isBlank(nominatimClass) && isBlank(type)) {
            return null;
        }
        if (isBlank(nominatimClass)) {
            return type;
        }
        if (isBlank(type)) {
            return nominatimClass;
        }
        return nominatimClass + "/" + type;
    }

    private String extractCityFromDisplayName(NominatimResponseDTO fallbackResponse) {
        Optional<CityInfoDTO> cityInfo = extractCityInfo(fallbackResponse);
        return cityInfo.map(CityInfoDTO::cityName).orElse("Unknown");
    }

    private String buildDisplayName(String cityName, String region, String country) {
        return String.join(", ", firstNonBlank(cityName, "Unknown"), firstNonBlank(region, "Unknown"), firstNonBlank(country, "Unknown"));
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

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
