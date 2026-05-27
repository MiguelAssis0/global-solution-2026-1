import { TileLayer } from "react-leaflet";

export function NdviLayer() {
  // OpenLandMap NDVI tiles - free, dynamic, and properly zoomable
  // Provides annual maximum NDVI data from Copernicus satellite imagery
  const url = "https://r.openlandmap.org/annual_max_ndvi/{z}/{x}/{y}.png";

  return (
    <TileLayer
      url={url}
      attribution="OpenLandMap / Copernicus"
      opacity={0.7}
      maxZoom={14}
    />
  );
}