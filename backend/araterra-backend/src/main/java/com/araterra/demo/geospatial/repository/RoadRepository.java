package com.araterra.demo.geospatial.repository;

import com.araterra.demo.geospatial.entity.Road;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoadRepository extends JpaRepository<Road, java.util.UUID> {

    @Query(value = """
        SELECT *
        FROM roads r
        ORDER BY ST_Distance(
            r.geometry::geography,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
        )
        LIMIT 1
    """, nativeQuery = true)
    Optional<Road> findNearestRoad(@Param("latitude") double latitude, @Param("longitude") double longitude);
}
