import { useEffect } from "react";
import { MapContainer as LeafletMap, TileLayer, Marker, Polyline, Polygon, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useMapStore } from "../../../store/mapStore";
import { DrawControl } from "../DrawControl/DrawControl";
import { RoadsLayer } from "../MapLayers/RoadsLayer";
import { PowerLayer } from "../MapLayers/PowerLayer";
import { AreasLayer } from "../MapLayers/AreasLayer";
import { SatelliteLayer } from "../MapLayers/SatelliteLayer";
import { NdviLayer } from "../MapLayers/NdviLayer";
import type { DrawMode } from "../../../types/map.types";

const DEFAULT_CENTER: [number, number] = [-15.7801, -47.9292];
const DEFAULT_ZOOM = 4;

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapSurfaceProps {
  drawMode: DrawMode;
  onBoundsChange: (bounds: any, zoom: number) => void;
  onPointSelect: (lat: number, lng: number) => void;
  onPolygonComplete: (vertices: [number, number][]) => void;
  roads: any;
  infrastructure: any;
  areas: any;
}

function MapEventHandler({
  drawMode,
  onPointSelect,
  onBoundsChange,
}: Omit<MapSurfaceProps, "roads" | "infrastructure" | "areas">) {
  const addVertex = useMapStore((state) => state.addVertex);
  const drawVertices = useMapStore((state) => state.drawVertices);

  const map = useMapEvents({
    click(e) {
      if (drawMode === "point") {
        onPointSelect(e.latlng.lat, e.latlng.lng);
      }
      if (drawMode === "polygon") {
        addVertex([e.latlng.lat, e.latlng.lng]);
      }
    },
    moveend() {
      const bounds = map.getBounds();
      onBoundsChange(bounds, map.getZoom());
    },
    zoomend() {
      const bounds = map.getBounds();
      onBoundsChange(bounds, map.getZoom());
    },
  });

  useEffect(() => {
    const bounds = map.getBounds();
    onBoundsChange(bounds, map.getZoom());
  }, [map, onBoundsChange]);

  useEffect(() => {
    if (drawMode === "polygon" && drawVertices.length >= 3) {
      // Keep polygon drawn interactively.
    }
  }, [drawMode, drawVertices.length]);

  return null;
}

export function MapSurface({
  drawMode,
  onBoundsChange,
  onPointSelect,
  onPolygonComplete,
  roads,
  infrastructure,
  areas,
}: MapSurfaceProps) {
  const drawVertices = useMapStore((state) => state.drawVertices);
  const activeLayers = useMapStore((state) => state.activeLayers);

  useEffect(() => {
    document.body.classList.toggle("satellite-active", activeLayers.satellite);
  }, [activeLayers.satellite]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <LeafletMap center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {activeLayers.satellite && <SatelliteLayer />}
        {activeLayers.ndvi && <NdviLayer />}
        {activeLayers.agriculturalAreas && <AreasLayer features={areas?.features ?? []} />}
        {activeLayers.roads && <RoadsLayer features={roads?.features ?? []} />}
        {activeLayers.power && <PowerLayer infrastructure={infrastructure} />}
        <MapEventHandler
          drawMode={drawMode}
          onBoundsChange={onBoundsChange}
          onPointSelect={onPointSelect}
          onPolygonComplete={onPolygonComplete}
        />
        <DrawControl onPolygonComplete={onPolygonComplete} />
        {drawMode === "point" && drawVertices.length === 1 ? (
          <Marker position={drawVertices[0]} icon={icon} />
        ) : null}
        {drawVertices.length > 0 ? <Polyline positions={drawVertices.map(([lat, lng]) => [lat, lng])} pathOptions={{ color: "#4da6ff" }} /> : null}
        {drawVertices.length >= 3 ? <Polygon positions={drawVertices.map(([lat, lng]) => [lat, lng])} pathOptions={{ color: "#a78bfa", fillOpacity: 0.2 }} /> : null}
      </LeafletMap>
    </div>
  );
}
