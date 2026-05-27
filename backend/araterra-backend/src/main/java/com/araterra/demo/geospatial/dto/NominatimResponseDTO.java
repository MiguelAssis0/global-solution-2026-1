package com.araterra.demo.geospatial.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NominatimResponseDTO(
        String name,
        String display_name,
        @JsonProperty("class")
        String nominatimClass,
        String type,
        NominatimAddressDTO address
) {
}
