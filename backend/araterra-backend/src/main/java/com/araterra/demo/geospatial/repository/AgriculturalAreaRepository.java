package com.araterra.demo.geospatial.repository;

import com.araterra.demo.geospatial.entity.AgriculturalArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgriculturalAreaRepository extends JpaRepository<AgriculturalArea, java.util.UUID> {

    @Query(value = """
        SELECT *
        FROM agricultural_areas a
        WHERE ST_Contains(
            a.geometry,
            ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
        )
        LIMIT 1
    """, nativeQuery = true)
    Optional<AgriculturalArea> findAreaContainingPoint(@Param("latitude") double latitude, @Param("longitude") double longitude);
}
