import { WMSTileLayer } from "react-leaflet";

export function NdviLayer() {
  return (
    <WMSTileLayer
      url="https://neo.gsfc.nasa.gov/wms/wms"
      layers="MOD_NDVI_M"
      format="image/png"
      transparent={true}
      opacity={0.6}
      attribution="NASA NEO"
    />
  );
}
