package com.araterra.demo.geospatial.dto;

import com.araterra.demo.AI.dtos.LocationAnalysisResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record ScoreRequestDTO(
        @NotNull
        @DecimalMin(value = "-90.0", inclusive = true)
        @DecimalMax(value = "90.0", inclusive = true)
        Double latitude,

        @NotNull
        @DecimalMin(value = "-180.0", inclusive = true)
        @DecimalMax(value = "180.0", inclusive = true)
        Double longitude,

        @Valid
        LocationAnalysisResponseDTO aiAnalysis
) {
}
