import { Polygon } from "react-leaflet";

interface AreaFeature {
  geometry: {
    type: string;
    coordinates: any;
  };
  properties?: {
    name?: string;
  };
}

interface AreasLayerProps {
  features: AreaFeature[];
}

function normalizePolygonCoordinates(coordinates: any): [number, number][][] {
  if (!Array.isArray(coordinates)) return [];

  if (typeof coordinates[0][0][0] === "number") {
    // Polygon: [ [ [lng, lat], ... ] ]
    return [coordinates as [number, number][]];
  }

  if (typeof coordinates[0][0][0] !== "undefined") {
    // MultiPolygon: [ [ [ [lng, lat], ... ] ], ... ]
    return coordinates as [number, number][][];
  }

  return [];
}

export function AreasLayer({ features }: AreasLayerProps) {
  if (!features?.length) return null;

  return (
    <>
      {features.flatMap((feature, index) => {
        if (!feature?.geometry || !feature.geometry.coordinates) return [];
        const coordsSet = normalizePolygonCoordinates(feature.geometry.coordinates);

        return coordsSet.map((ring, ringIndex) => {
          const positions = ring.map(([lng, lat]) => [lat, lng] as [number, number]);
          return (
            <Polygon
              key={`${index}-${ringIndex}`}
              positions={positions}
              pathOptions={{ color: "#5aa9ff", weight: 2, fillOpacity: 0.15, fillColor: "#5aa9ff" }}
            />
          );
        });
      })}
    </>
  );
}
