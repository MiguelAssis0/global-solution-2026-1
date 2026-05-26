package com.araterra.demo.geospatial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegionSummaryRequest {

    private Double latitude;

    private Double longitude;

    private Boolean generateAiInsight = false;
}
