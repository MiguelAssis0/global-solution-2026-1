import type { AnalysisResult } from "../../../types/analysis.types";
import { formatScore } from "../../../utils/format";

interface ScoreBlockProps {
  result: AnalysisResult;
  loading: boolean;
}

const classificationStyles = {
  alta: {
    bg: "var(--color-badge-high-bg)",
    color: "var(--color-badge-high-text)",
  },
  media: {
    bg: "var(--color-badge-mid-bg)",
    color: "var(--color-badge-mid-text)",
  },
  baixa: {
    bg: "var(--color-badge-low-bg)",
    color: "var(--color-badge-low-text)",
  },
};

export function ScoreBlock({ result, loading }: ScoreBlockProps) {
  if (loading) {
    return (
      <div style={{ padding: 20, background: "var(--color-card-bg)", borderRadius: 8 }}>
        Carregando análise...
      </div>
    );
  }

  const classification = result.score.classification ?? "baixa";
  const classificationLabel =
    result.score.classificationLabel ??
    (classification === "alta" ? "Alta" : classification === "media" ? "Média" : "Baixa");

  const metrics = [
    { label: "Estradas", value: result.score.roadsScore },
    { label: "Vegetação", value: result.score.ndviScore },
    { label: "Energia", value: result.score.energyScore },
  ];

  return (
    <section
      style={{
        marginBottom: 18,
        padding: 20,
        borderRadius: 8,
        background: "var(--color-card-bg)",
        border: "1px solid var(--color-card-border)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 18 }}>
        <div>
          <p style={{ fontSize: "0.86rem", color: "var(--color-text-2)", marginBottom: 6 }}>Score territorial</p>
          <p style={{ fontSize: "2.35rem", color: "var(--color-text)", margin: 0, fontWeight: 800 }}>
            {formatScore(result.score.finalScore)}
          </p>
        </div>
        <span
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            background: classificationStyles[classification].bg,
            color: classificationStyles[classification].color,
            fontWeight: 800,
          }}
        >
          {classificationLabel}
        </span>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {metrics.map((item) => (
          <div key={item.label} style={{ display: "grid", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.86rem", color: "var(--color-text-2)" }}>
              <span>{item.label}</span>
              <span>{item.value != null ? `${item.value}%` : "--"}</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "var(--color-progress-track)" }}>
              <div style={{ width: `${item.value ?? 0}%`, height: "100%", background: "var(--color-accent)", borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
