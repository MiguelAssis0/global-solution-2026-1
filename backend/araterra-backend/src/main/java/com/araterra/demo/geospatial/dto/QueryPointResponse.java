package com.araterra.demo.geospatial.dto;

import com.araterra.demo.geospatial.enums.InfrastructureType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueryPointResponse {

    private Double latitude;

    private Double longitude;

    private String nearestRoadName;

    private Double distanceToRoadKm;

    private String nearestInfrastructureName;

    private InfrastructureType nearestInfrastructureType;

    private Double distanceToInfrastructureKm;

    private String areaType;

    private Double vegetationIndex;
}
