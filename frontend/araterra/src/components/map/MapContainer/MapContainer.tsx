import { useEffect, useRef } from "react";
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  useMapEvents,
} from "react-leaflet";
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
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
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
  const setMousePosition = useMapStore((state) => state.setMousePosition);
  const setSelectedPoint = useMapStore((state) => state.setSelectedPoint);
  const clearCompletedPolygons = useMapStore(
    (state) => state.clearCompletedPolygons,
  );

  const ignoreNextClick = useRef(false);

  const map = useMapEvents({
    click(e) {
      const target = e.originalEvent.target as HTMLElement;
      const isUIElement =
        target.closest("button, [class*='control'], [class*='Control']") !==
        null;
      if (isUIElement) return;

      if (drawMode === "point") {
        clearCompletedPolygons();
        setSelectedPoint([e.latlng.lat, e.latlng.lng]);
        onPointSelect(e.latlng.lat, e.latlng.lng);
      }
      if (drawMode === "polygon") {
        addVertex([e.latlng.lat, e.latlng.lng]);
      }
    },
    mousemove(e) {
      if (drawMode === "polygon") {
        setMousePosition([e.latlng.lat, e.latlng.lng]);
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
    if (drawMode !== "polygon") {
      setMousePosition(null);
    }
  }, [drawMode, setMousePosition]);

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
  const mousePosition = useMapStore((state) => state.mousePosition);
  const completedPolygons = useMapStore((state) => state.completedPolygons);
  const selectedPoint = useMapStore((state) => state.selectedPoint);

  useEffect(() => {
    document.body.classList.toggle("satellite-active", activeLayers.satellite);
  }, [activeLayers.satellite]);

  const vertexIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    className: "vertex-marker",
  });

  const previewLinePositions =
    drawMode === "polygon" && drawVertices.length > 0 && mousePosition
      ? [...drawVertices, mousePosition]
      : [];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <LeafletMap
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {activeLayers.satellite && <SatelliteLayer />}
        {activeLayers.ndvi && <NdviLayer />}
        {activeLayers.agriculturalAreas && (
          <AreasLayer features={areas?.features ?? []} />
        )}
        {activeLayers.roads && <RoadsLayer features={roads?.features ?? []} />}
        {activeLayers.power && <PowerLayer infrastructure={infrastructure} />}
        <MapEventHandler
          drawMode={drawMode}
          onBoundsChange={onBoundsChange}
          onPointSelect={onPointSelect}
          onPolygonComplete={onPolygonComplete}
        />
        <DrawControl onPolygonComplete={onPolygonComplete} />
        {drawMode !== "polygon" && selectedPoint && (
          <Marker position={selectedPoint} icon={icon} />
        )}
        {completedPolygons.map((polygon, index) => (
          <Polygon
            key={index}
            positions={polygon.map(([lat, lng]) => [lat, lng])}
            pathOptions={{ color: "#a78bfa", fillOpacity: 0.2 }}
          />
        ))}
        {drawMode === "polygon" &&
          drawVertices.length > 0 &&
          drawVertices.map((vertex, index) => (
            <Marker
              key={`vertex-${index}`}
              position={vertex}
              icon={vertexIcon}
            />
          ))}
        {drawMode === "polygon" && drawVertices.length > 0 && (
          <Polyline
            key="drawing-polyline"
            positions={drawVertices.map(([lat, lng]) => [lat, lng])}
            pathOptions={{ color: "#4da6ff", weight: 3 }}
          />
        )}
        {drawMode === "polygon" && previewLinePositions.length > 0 && (
          <Polyline
            key="preview-polyline"
            positions={previewLinePositions.map(([lat, lng]) => [lat, lng])}
            pathOptions={{
              color: "#4da6ff",
              weight: 2,
              dashArray: "5, 10",
              opacity: 0.6,
            }}
          />
        )}
        {drawMode === "polygon" && drawVertices.length >= 3 && (
          <Polygon
            key="drawing-polygon"
            positions={drawVertices.map(([lat, lng]) => [lat, lng])}
            pathOptions={{ color: "#a78bfa", fillOpacity: 0.1 }}
          />
        )}
      </LeafletMap>
    </div>
  );
}
