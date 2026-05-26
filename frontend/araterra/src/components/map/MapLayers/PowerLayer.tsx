import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface PowerLayerProps {
  infrastructure: any;
}

const icon = new L.DivIcon({
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#ffcc00;border: 2px solid #fff"></div>`,
  className: "infrastructure-marker",
});

export function PowerLayer({ infrastructure }: PowerLayerProps) {
  const features = infrastructure?.features ?? infrastructure?.points ?? infrastructure?.items ?? [];
  if (!features?.length) return null;

  return (
    <>
      {features.map((feature: any, index: number) => {
        const geometry = feature.geometry ?? feature;
        const coordinates = geometry.coordinates ?? geometry?.location;
        if (!coordinates) return null;

        const [lng, lat] = Array.isArray(coordinates) ? coordinates : [coordinates.lng, coordinates.lat];
        if (lat == null || lng == null) return null;

        const name = feature.properties?.name ?? feature.properties?.type ?? feature.name ?? feature.type ?? "Infraestrutura";

        return (
          <Marker key={index} position={[lat, lng]} icon={icon}>
            <Popup>{name}</Popup>
          </Marker>
        );
      })}
    </>
  );
}
