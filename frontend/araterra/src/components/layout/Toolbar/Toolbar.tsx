import { ArrowRightLeft, MapPin, Square } from "lucide-react";
import { useDrawMode } from "../../../hooks/useDrawMode";
import type { LayerName, DrawMode } from "../../../types/map.types";
import { useMapStore } from "../../../store/mapStore";
import styles from "./Toolbar.module.css";

interface ToolbarProps {
  activeLayers: Record<LayerName, boolean>;
  drawMode: DrawMode;
}

const layerLabels: Record<LayerName, string> = {
  satellite: "Satélite",
  ndvi: "NDVI",
};

export function Toolbar({ activeLayers, drawMode }: ToolbarProps) {
  const { startMode, cancelDraw } = useDrawMode();
  const toggleLayer = useMapStore((state) => state.toggleLayer);

  return (
    <section className={styles.toolbar}>
      <div className={styles.controls}>
        {drawMode !== "polygon" && (
          <button type="button" onClick={() => startMode("point")} className={drawMode === "point" ? styles.active : ""}>
            <MapPin size={16} /> Ponto
          </button>
        )}
        <button type="button" onClick={() => startMode("polygon")} className={drawMode === "polygon" ? styles.active : ""}>
          <Square size={16} /> Polígono
        </button>
        <button type="button" onClick={cancelDraw}>
          <ArrowRightLeft size={16} /> Limpar
        </button>
      </div>
      <div className={styles.layers}>
        {Object.keys(activeLayers).map((key) => (
          <button
            key={key}
            type="button"
            className={activeLayers[key as LayerName] ? styles.layerActive : ""}
            onClick={() => toggleLayer(key as LayerName)}
          >
            {layerLabels[key as LayerName]}
          </button>
        ))}
      </div>
    </section>
  );
}
