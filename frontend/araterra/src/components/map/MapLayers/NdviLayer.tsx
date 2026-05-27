import { TileLayer } from "react-leaflet";

export function NdviLayer() {
  const url =
    `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/` +
    `VIIRS_SNPP_NDVI_8Day/default/default/` +
    `GoogleMapsCompatible_Level8/{z}/{y}/{x}.png`;

  return (
    <TileLayer
      url={url}
      attribution="NASA GIBS / VIIRS SNPP"
      opacity={0.8}
      maxZoom={8}
      tileSize={256}
    />
  );
}