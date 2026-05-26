import type { InfraResult } from "../../../types/analysis.types";
import { formatDistance } from "../../../utils/format";

interface InfraBlockProps {
  infra: InfraResult;
}

export function InfraBlock({ infra }: InfraBlockProps) {
  return (
    <section style={{ marginBottom: 24, padding: 20, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ marginBottom: 16, fontWeight: 700 }}>Infraestrutura</div>
      <div style={{ display: "grid", gap: 12 }}>
        {[
          { label: "Cidade mais próxima", value: infra.nearestCity },
          { label: "Subestação", value: infra.nearestSubstation },
          { label: "Porto", value: infra.nearestPort },
        ].map((item) => (
          <div key={item.label} style={{ padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.04)" }}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.83rem" }}>{item.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: "1rem", color: "var(--color-text)" }}>
              {item.value ? `${item.value.name} • ${formatDistance(item.value.distKm)}` : "Nenhum dado disponível"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
