package com.araterra.demo.geospatial.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.locationtech.jts.geom.Polygon;

import java.util.UUID;

@Entity
@Table(name = "agricultural_areas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgriculturalArea {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String cropType;

    private Double vegetationIndex;

    @Column(columnDefinition = "geometry(Polygon,4326)")
    private Polygon geometry;
}
