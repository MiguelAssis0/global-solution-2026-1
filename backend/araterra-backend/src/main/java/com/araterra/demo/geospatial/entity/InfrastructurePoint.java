package com.araterra.demo.geospatial.entity;

import com.araterra.demo.geospatial.enums.InfrastructureType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.locationtech.jts.geom.Point;

import java.util.UUID;

@Entity
@Table(name = "infrastructure_points")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InfrastructurePoint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Enumerated(EnumType.STRING)
    private InfrastructureType type;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point geometry;
}
