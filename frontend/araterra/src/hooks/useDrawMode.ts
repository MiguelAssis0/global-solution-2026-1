import { useCallback } from "react";
import { useMapStore } from "../store/mapStore";
import type { DrawMode } from "../types/map.types";

export function useDrawMode() {
  const drawMode = useMapStore((state) => state.drawMode);
  const setDrawMode = useMapStore((state) => state.setDrawMode);
  const addVertex = useMapStore((state) => state.addVertex);
  const clearVertices = useMapStore((state) => state.clearVertices);

  const startMode = useCallback(
    (mode: DrawMode) => {
      clearVertices();
      setDrawMode(mode);
    },
    [clearVertices, setDrawMode],
  );

  const cancelDraw = useCallback(() => {
    clearVertices();
    setDrawMode("idle");
  }, [clearVertices, setDrawMode]);

  return {
    drawMode,
    startMode,
    addVertex,
    cancelDraw,
    clearVertices,
  };
}
