import type { AiLocationAnalysis, InfraResult } from "../../../types/analysis.types";
import { formatDistance } from "../../../utils/format";
import type { CityInfo } from "../../../services/nominatimService";

interface InfraBlockProps {
  infra: InfraResult;
  aiAnalysis?: AiLocationAnalysis | null;
  cityInfo?: CityInfo | null;
  cityLoading?: boolean;
}

function formatAiDistance(distanceKm: number | null | undefined) {
  if (distanceKm == null || Number.isNaN(distanceKm)) {
    return null;
  }

  return formatDistance(distanceKm);
}

export function InfraBlock({
  infra,
  aiAnalysis,
  cityInfo,
  cityLoading = false,
}: InfraBlockProps) {
  const waitingText = "Aguarde...";

  const cityDisplay = cityInfo
    ? `${cityInfo.cityName}, ${cityInfo.state} • ${cityInfo.country}`
    : infra.nearestCity
    ? `${infra.nearestCity.name} • ${formatDistance(infra.nearestCity.distKm)}`
    : "Nenhum dado disponível";

  const substationDisplay = aiAnalysis?.nearestSubstation?.name
    ? `${aiAnalysis.nearestSubstation.name}${formatAiDistance(aiAnalysis.nearestSubstation.distanceKm) ? ` • ${formatAiDistance(aiAnalysis.nearestSubstation.distanceKm)}` : ""}`
    : waitingText;

  const portDisplay = aiAnalysis?.nearestPort?.name
    ? `${aiAnalysis.nearestPort.name}${formatAiDistance(aiAnalysis.nearestPort.distanceKm) ? ` • ${formatAiDistance(aiAnalysis.nearestPort.distanceKm)}` : ""}`
    : waitingText;

  const highwayDisplay = aiAnalysis?.nearestHighway?.name
    ? `${aiAnalysis.nearestHighway.name}${aiAnalysis.nearestHighway.roadType ? ` • ${aiAnalysis.nearestHighway.roadType}` : ""}${formatAiDistance(aiAnalysis.nearestHighway.distanceKm) ? ` • ${formatAiDistance(aiAnalysis.nearestHighway.distanceKm)}` : ""}`
    : waitingText;

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
      <div style={{ marginBottom: 16, fontWeight: 800 }}>Infraestrutura</div>
      <div style={{ display: "grid", gap: 12 }}>
        {[
          { label: "Cidade mais próxima", value: infra.nearestCity, display: cityDisplay, isLoading: cityLoading },
          { label: "Subestação", display: substationDisplay },
          { label: "Porto", display: portDisplay },
          { label: "Rodovia principal", display: highwayDisplay },
        ].map((item) => (
          <div key={item.label} style={{ padding: 14, borderRadius: 8, background: "var(--color-card-inner-bg)" }}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.83rem" }}>{item.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: "0.98rem", color: "var(--color-text)", fontWeight: 700 }}>
              {item.isLoading ? "Carregando..." : item.display || (item.value ? `${item.value.name} • ${formatDistance(item.value.distKm)}` : "Nenhum dado disponível")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
