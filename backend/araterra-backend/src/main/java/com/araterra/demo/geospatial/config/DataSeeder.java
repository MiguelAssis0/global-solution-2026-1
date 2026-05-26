package com.araterra.demo.geospatial.config;

import com.araterra.demo.geospatial.entity.AgriculturalArea;
import com.araterra.demo.geospatial.entity.InfrastructurePoint;
import com.araterra.demo.geospatial.entity.Road;
import com.araterra.demo.geospatial.enums.InfrastructureType;
import com.araterra.demo.geospatial.repository.AgriculturalAreaRepository;
import com.araterra.demo.geospatial.repository.InfrastructurePointRepository;
import com.araterra.demo.geospatial.repository.RoadRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Value("${data.seeder.enabled:false}")
    private boolean seederEnabled;

    private final RoadRepository roadRepository;
    private final AgriculturalAreaRepository agriculturalAreaRepository;
    private final InfrastructurePointRepository infrastructurePointRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public DataSeeder(RoadRepository roadRepository,
                       AgriculturalAreaRepository agriculturalAreaRepository,
                       InfrastructurePointRepository infrastructurePointRepository) {
        this.roadRepository = roadRepository;
        this.agriculturalAreaRepository = agriculturalAreaRepository;
        this.infrastructurePointRepository = infrastructurePointRepository;
    }

    @Override
    public void run(String... args) {
        if (!seederEnabled) {
            return;
        }

        if (roadRepository.count() > 0) {
            return;
        }

        seedRoads();
        seedAgriculturalAreas();
        seedInfrastructurePoints();
    }

    private void seedRoads() {
        Coordinate[] coords1 = new Coordinate[]{
            new Coordinate(-54.5, -30.0),
            new Coordinate(-54.3, -30.2),
            new Coordinate(-54.1, -30.4)
        };
        LineString lineString1 = geometryFactory.createLineString(coords1);
        Road br290 = new Road();
        br290.setName("BR-290");
        br290.setType("Highway");
        br290.setGeometry(lineString1);

        Coordinate[] coords2 = new Coordinate[]{
            new Coordinate(-54.6, -30.1),
            new Coordinate(-54.4, -30.3),
            new Coordinate(-54.2, -30.5)
        };
        LineString lineString2 = geometryFactory.createLineString(coords2);
        Road rs630 = new Road();
        rs630.setName("RS-630");
        rs630.setType("State Road");
        rs630.setGeometry(lineString2);

        roadRepository.saveAll(List.of(br290, rs630));
    }

    private void seedAgriculturalAreas() {
        Coordinate[] coords1 = new Coordinate[]{
            new Coordinate(-54.4, -30.1),
            new Coordinate(-54.2, -30.1),
            new Coordinate(-54.2, -30.3),
            new Coordinate(-54.4, -30.3),
            new Coordinate(-54.4, -30.1)
        };
        Polygon polygon1 = geometryFactory.createPolygon(coords1);
        AgriculturalArea northArea = new AgriculturalArea();
        northArea.setName("Área Agrícola Norte");
        northArea.setCropType("Soybeans");
        northArea.setVegetationIndex(0.75);
        northArea.setGeometry(polygon1);

        Coordinate[] coords2 = new Coordinate[]{
            new Coordinate(-54.3, -30.4),
            new Coordinate(-54.1, -30.4),
            new Coordinate(-54.1, -30.6),
            new Coordinate(-54.3, -30.6),
            new Coordinate(-54.3, -30.4)
        };
        Polygon polygon2 = geometryFactory.createPolygon(coords2);
        AgriculturalArea southArea = new AgriculturalArea();
        southArea.setName("Área Agrícola Sul");
        southArea.setCropType("Corn");
        southArea.setVegetationIndex(0.68);
        southArea.setGeometry(polygon2);

        agriculturalAreaRepository.saveAll(List.of(northArea, southArea));
    }

    private void seedInfrastructurePoints() {
        Point point1 = geometryFactory.createPoint(new Coordinate(-54.35, -30.25));
        InfrastructurePoint substation = new InfrastructurePoint();
        substation.setName("Subestação São Gabriel");
        substation.setType(InfrastructureType.SUBSTATION);
        substation.setGeometry(point1);

        Point point2 = geometryFactory.createPoint(new Coordinate(-54.45, -30.15));
        InfrastructurePoint logisticCenter = new InfrastructurePoint();
        logisticCenter.setName("Centro Logístico");
        logisticCenter.setType(InfrastructureType.LOGISTIC_CENTER);
        logisticCenter.setGeometry(point2);

        Point point3 = geometryFactory.createPoint(new Coordinate(-54.25, -30.45));
        InfrastructurePoint farm = new InfrastructurePoint();
        farm.setName("Fazenda Modelo");
        farm.setType(InfrastructureType.FARM);
        farm.setGeometry(point3);

        infrastructurePointRepository.saveAll(List.of(substation, logisticCenter, farm));
    }
}
