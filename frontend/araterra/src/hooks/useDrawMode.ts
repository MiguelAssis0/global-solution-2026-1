import { useCallback } from "react";
import { useMapStore } from "../store/mapStore";
import type { DrawMode } from "../types/map.types";

export function useDrawMode() {
  const drawMode = useMapStore((state) => state.drawMode);
  const setDrawMode = useMapStore((state) => state.setDrawMode);
  const addVertex = useMapStore((state) => state.addVertex);
  const clearVertices = useMapStore((state) => state.clearVertices);
  const clearCompletedPolygons = useMapStore((state) => state.clearCompletedPolygons);
  const setSelectedPoint = useMapStore((state) => state.setSelectedPoint);

  const startMode = useCallback(
    (mode: DrawMode) => {
      clearVertices();
      if (mode === "polygon") {
        clearCompletedPolygons();
        setSelectedPoint(null);
      }
      setDrawMode(mode);
    },
    [clearVertices, clearCompletedPolygons, setSelectedPoint, setDrawMode],
  );

  const cancelDraw = useCallback(() => {
    clearVertices();
    clearCompletedPolygons();
    setSelectedPoint(null);
    setDrawMode("idle");
  }, [clearVertices, clearCompletedPolygons, setSelectedPoint, setDrawMode]);

  return {
    drawMode,
    startMode,
    addVertex,
    cancelDraw,
    clearVertices,
  };
}
