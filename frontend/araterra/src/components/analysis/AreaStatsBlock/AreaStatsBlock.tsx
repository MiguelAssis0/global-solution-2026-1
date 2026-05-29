import type { AiLocationAnalysis, AnalysisResult } from "../../../types/analysis.types";
import { formatArea, formatCoords } from "../../../utils/format";

interface AreaStatsBlockProps {
  analysis: AnalysisResult;
  aiAnalysis?: AiLocationAnalysis | null;
}

export function AreaStatsBlock({ analysis, aiAnalysis }: AreaStatsBlockProps) {
  const biomeName = aiAnalysis?.biome?.name;
  const biomeCategory = aiAnalysis?.biome?.category;
  const confidence = aiAnalysis?.biome?.confidence;
  const region = aiAnalysis?.locationContext?.region;
  const country = aiAnalysis?.locationContext?.country;
  const waitingText = "Aguarde...";

  return (
    <section
      style={{
        marginBottom: 18,
        padding: 20,
        borderRadius: 8,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      <div style={{ marginBottom: 16, fontWeight: 800 }}>Resumo da área</div>
      {analysis.type === "point" ? (
        <div style={{ display: "grid", gap: 10, color: "var(--color-text-2)", fontSize: "0.94rem" }}>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Coordenadas:</strong> {formatCoords(analysis.lat, analysis.lng)}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Bioma:</strong> {biomeName ?? waitingText}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Categoria:</strong> {biomeCategory ?? waitingText}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Confiança:</strong> {confidence ?? waitingText}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Região:</strong> {region ?? waitingText}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>País:</strong> {country ?? waitingText}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10, color: "var(--color-text-2)", fontSize: "0.94rem" }}>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Área:</strong> {formatArea(analysis.areaKm2)}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Vértices:</strong> {analysis.numVertices}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Geom.:</strong> {formatCoords(analysis.centroidLat, analysis.centroidLng)}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Biomas:</strong> {biomeName ?? waitingText}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Categoria:</strong> {biomeCategory ?? waitingText}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Confiança:</strong> {confidence ?? waitingText}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>Região:</strong> {region ?? waitingText}</p>
          <p style={{ margin: 0 }}><strong style={{ color: "var(--color-text)" }}>País:</strong> {country ?? waitingText}</p>
        </div>
      )}
    </section>
  );
}
