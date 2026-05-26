import { TileLayer } from "react-leaflet";

export function SatelliteLayer() {
  const date = new Date().toISOString().slice(0, 10);
  return (
    <TileLayer
      url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible/{z}/{y}/{x}.jpg`}
      attribution="NASA GIBS"
      opacity={0.95}
    />
  );
}
