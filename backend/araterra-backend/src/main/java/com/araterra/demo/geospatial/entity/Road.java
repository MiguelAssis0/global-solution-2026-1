package com.araterra.demo.geospatial.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.locationtech.jts.geom.LineString;

import java.util.UUID;

@Entity
@Table(name = "roads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Road {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String type;

    @Column(columnDefinition = "geometry(LineString,4326)")
    private LineString geometry;
}
