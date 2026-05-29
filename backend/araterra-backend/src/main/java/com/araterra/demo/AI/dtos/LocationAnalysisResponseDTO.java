package com.araterra.demo.AI.dtos;

public record LocationAnalysisResponseDTO(
        InputDTO input,
        LocationContextDTO locationContext,
        BiomeDTO biome,
        NearestInfrastructureDTO nearestSubstation,
        NearestInfrastructureDTO nearestPort,
        NearestHighwayDTO nearestHighway
) {
    public record InputDTO(
            Double latitude,
            Double longitude
    ) {
    }

    public record BiomeDTO(
            String name,
            String category,
            String confidence
    ) {
    }

    public record LocationContextDTO(
            String country,
            String region
    ) {
    }

    public record NearestInfrastructureDTO(
            String name,
            Double distanceKm
    ) {
    }

    public record NearestHighwayDTO(
            String name,
            Double distanceKm,
            String roadType
    ) {
    }
}
