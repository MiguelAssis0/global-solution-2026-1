import type { InfraResult } from "../../../types/analysis.types";
import { formatDistance } from "../../../utils/format";

interface InfraBlockProps {
  infra: InfraResult;
}

export function InfraBlock({ infra }: InfraBlockProps) {
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
      <div style={{ marginBottom: 16, fontWeight: 800 }}>Infraestrutura</div>
      <div style={{ display: "grid", gap: 12 }}>
        {[
          { label: "Cidade mais próxima", value: infra.nearestCity },
          { label: "Subestação", value: infra.nearestSubstation },
          { label: "Porto", value: infra.nearestPort },
        ].map((item) => (
          <div key={item.label} style={{ padding: 14, borderRadius: 8, background: "rgba(255,255,255,0.08)" }}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.83rem" }}>{item.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: "0.98rem", color: "var(--color-text)", fontWeight: 700 }}>
              {item.value ? `${item.value.name} • ${formatDistance(item.value.distKm)}` : "Nenhum dado disponível"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
