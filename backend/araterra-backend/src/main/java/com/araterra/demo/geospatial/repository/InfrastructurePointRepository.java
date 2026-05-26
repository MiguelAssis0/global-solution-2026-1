package com.araterra.demo.geospatial.repository;

import com.araterra.demo.geospatial.entity.InfrastructurePoint;
import com.araterra.demo.geospatial.enums.InfrastructureType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InfrastructurePointRepository extends JpaRepository<InfrastructurePoint, java.util.UUID> {

    List<InfrastructurePoint> findByType(InfrastructureType type);

    @Query(value = """
        SELECT *
        FROM infrastructure_points i
        ORDER BY ST_Distance(
            i.geometry::geography,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
        )
        LIMIT 1
    """, nativeQuery = true)
    Optional<InfrastructurePoint> findNearestInfrastructure(@Param("latitude") double latitude, @Param("longitude") double longitude);
}
