package com.araterra.demo.geospatial.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NominatimAddressDTO(
        String road,
        String railway,
        String suburb,
        String city,
        String state,
        String country,
        String country_code,
        String town,
        String village,
        String municipality,
        String county
) {
}
