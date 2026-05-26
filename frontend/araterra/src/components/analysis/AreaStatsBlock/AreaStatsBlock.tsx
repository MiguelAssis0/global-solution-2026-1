import type { AnalysisResult } from "../../../types/analysis.types";
import { formatArea, formatCoords } from "../../../utils/format";

interface AreaStatsBlockProps {
  analysis: AnalysisResult;
}

export function AreaStatsBlock({ analysis }: AreaStatsBlockProps) {
  return (
    <section style={{ marginBottom: 24, padding: 20, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ marginBottom: 16, fontWeight: 700 }}>Resumo da área</div>
      {analysis.type === "point" ? (
        <div style={{ display: "grid", gap: 10 }}>
          <p style={{ margin: 0 }}><strong>Coordenadas:</strong> {formatCoords(analysis.lat, analysis.lng)}</p>
          <p style={{ margin: 0 }}><strong>Bioma:</strong> {analysis.biome}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          <p style={{ margin: 0 }}><strong>Área:</strong> {formatArea(analysis.areaKm2)}</p>
          <p style={{ margin: 0 }}><strong>Vértices:</strong> {analysis.numVertices}</p>
          <p style={{ margin: 0 }}><strong>Geom.</strong> {formatCoords(analysis.centroidLat, analysis.centroidLng)}</p>
          <p style={{ margin: 0 }}><strong>Biomas:</strong> {analysis.biomes.join(", ")}</p>
        </div>
      )}
    </section>
  );
}
