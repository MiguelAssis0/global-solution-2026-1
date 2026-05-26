import { Polyline } from "react-leaflet";

interface RoadsLayerProps {
  features: any[];
}

export function RoadsLayer({ features }: RoadsLayerProps) {
  if (!features?.length) return null;

  return (
    <>
      {features.map((feature, index) => {
        const coords = feature.geometry?.coordinates?.map(([lng, lat]: [number, number]) => [lat, lng]);
        if (!coords || !coords.length) return null;
        return <Polyline key={index} positions={coords} pathOptions={{ color: "#60a0ff", weight: 3, opacity: 0.8 }} />;
      })}
    </>
  );
}
