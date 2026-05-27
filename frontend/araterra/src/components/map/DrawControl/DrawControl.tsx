import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import { useMapStore } from "../../../store/mapStore";
import styles from "./DrawControl.module.css";

interface DrawControlProps {
  onPolygonComplete: (vertices: [number, number][]) => void;
}

export function DrawControl({ onPolygonComplete }: DrawControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawMode = useMapStore((state) => state.drawMode);
  const vertices = useMapStore((state) => state.drawVertices);
  const clearVertices = useMapStore((state) => state.clearVertices);
  const setDrawMode = useMapStore((state) => state.setDrawMode);
  const removeLastVertex = useMapStore((state) => state.removeLastVertex);
  const addCompletedPolygon = useMapStore((state) => state.addCompletedPolygon);

  // Impede que cliques nos botões cheguem ao mapa
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    L.DomEvent.disableClickPropagation(el);
  }, []);

  const finishPolygon = useCallback(() => {
    const currentVertices = useMapStore.getState().drawVertices;
    if (currentVertices.length >= 3) {
      const verticesCopy = [...currentVertices];
      addCompletedPolygon(verticesCopy);
      setDrawMode("idle");
      onPolygonComplete(verticesCopy);
    }
  }, [addCompletedPolygon, onPolygonComplete, setDrawMode]);

  const cancelDraw = useCallback(() => {
    clearVertices();
    setDrawMode("idle");
  }, [clearVertices, setDrawMode]);

  const undoLastPoint = useCallback(() => {
    removeLastVertex();
  }, [removeLastVertex]);

  if (drawMode !== "polygon") return null;

  return (
    <div
      ref={containerRef}
      className={styles.controlPanel}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.hint}>Clique no mapa para desenhar vértices.</div>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={undoLastPoint}
          disabled={vertices.length === 0}
          draggable="false"
        >
          Desfazer último ponto
        </button>
        <button
          type="button"
          onClick={finishPolygon}
          disabled={vertices.length < 3}
          draggable="false"
        >
          Finalizar polígono
        </button>
        <button type="button" onClick={cancelDraw} draggable="false">
          Cancelar
        </button>
      </div>
    </div>
  );
}
