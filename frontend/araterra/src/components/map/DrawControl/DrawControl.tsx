import { useCallback } from "react";
import { useMapStore } from "../../../store/mapStore";
import styles from "./DrawControl.module.css";

interface DrawControlProps {
  onPolygonComplete: (vertices: [number, number][]) => void;
}

export function DrawControl({ onPolygonComplete }: DrawControlProps) {
  const drawMode = useMapStore((state) => state.drawMode);
  const vertices = useMapStore((state) => state.drawVertices);
  const clearVertices = useMapStore((state) => state.clearVertices);
  const setDrawMode = useMapStore((state) => state.setDrawMode);

  const finishPolygon = useCallback(() => {
    if (vertices.length >= 3) {
      onPolygonComplete(vertices);
      clearVertices();
      setDrawMode("idle");
    }
  }, [clearVertices, onPolygonComplete, setDrawMode, vertices]);

  const cancelDraw = useCallback(() => {
    clearVertices();
    setDrawMode("idle");
  }, [clearVertices, setDrawMode]);

  if (drawMode !== "polygon") {
    return null;
  }

  return (
    <div className={styles.controlPanel}>
      <div className={styles.hint}>Clique no mapa para desenhar vértices.</div>
      <div className={styles.actions}>
        <button type="button" onClick={finishPolygon} disabled={vertices.length < 3}>
          Finalizar polígono
        </button>
        <button type="button" onClick={cancelDraw}>Cancelar</button>
      </div>
    </div>
  );
}
