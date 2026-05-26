import type { AnalysisResult } from "../../../types/analysis.types";
import { formatScore } from "../../../utils/format";

interface ScoreBlockProps {
  result: AnalysisResult;
  loading: boolean;
}

const classificationColor = {
  alta: "var(--color-score-high)",
  media: "var(--color-score-mid)",
  baixa: "var(--color-score-low)",
};

export function ScoreBlock({ result, loading }: ScoreBlockProps) {
  if (loading) {
    return <div style={{ padding: 20, background: "rgba(255,255,255,0.04)", borderRadius: 16 }}>Carregando análise...</div>;
  }

  const classification = result.score.classification ?? "baixa";
  const classificationLabel = result.score.classificationLabel ?? (classification === "alta" ? "Alta" : classification === "media" ? "Média" : "Baixa");

  const metrics = [
    { label: "Estradas", value: result.score.roadsScore },
    { label: "Vegetação", value: result.score.ndviScore },
    { label: "Energia", value: result.score.energyScore },
  ];

  return (
    <section style={{ marginBottom: 24, padding: 20, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-2)", marginBottom: 6 }}>Score de aptidão</p>
          <p style={{ fontSize: "2.5rem", color: "var(--color-text)", margin: 0 }}>{formatScore(result.score.finalScore)}</p>
        </div>
        <span style={{ padding: "8px 14px", borderRadius: 999, background: classificationColor[classification], color: "#0b130a", fontWeight: 700 }}>
          {classificationLabel}
        </span>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {metrics.map((item) => (
          <div key={item.label} style={{ display: "grid", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "var(--color-text-2)" }}>
              <span>{item.label}</span>
              <span>{item.value != null ? `${item.value}%` : "--"}</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.06)" }}>
              <div style={{ width: `${item.value ?? 0}%`, height: "100%", background: "var(--color-accent)", borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
