package com.araterra.demo.geospatial.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinateRequest {

    @Min(-90)
    @Max(90)
    private Double latitude;

    @Min(-180)
    @Max(180)
    private Double longitude;
}
