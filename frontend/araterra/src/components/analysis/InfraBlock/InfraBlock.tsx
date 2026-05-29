import type { AnalysisResult, InfraResult } from "../../../types/analysis.types";
import { formatDistance } from "../../../utils/format";
import { useCityInfo } from "../../../hooks/useCityInfo";

interface InfraBlockProps {
  infra: InfraResult;
  analysis?: AnalysisResult | null;
}

export function InfraBlock({ infra, analysis }: InfraBlockProps) {
  // Get coordinates from analysis
  const lat = analysis ? ("lat" in analysis ? analysis.lat : analysis.centroidLat) : undefined;
  const lng = analysis ? ("lng" in analysis ? analysis.lng : analysis.centroidLng) : undefined;

  // Fetch real city info from Nominatim
  const { cityInfo, isLoading } = useCityInfo({
    lat,
    lng,
    enabled: !!analysis,
  });

  // Build the city display with real data from Nominatim if available
  const cityDisplay = cityInfo
    ? `${cityInfo.cityName}, ${cityInfo.state} • ${cityInfo.country}`
    : infra.nearestCity
    ? `${infra.nearestCity.name} • ${formatDistance(infra.nearestCity.distKm)}`
    : "Nenhum dado disponível";

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
          { label: "Cidade mais próxima", value: infra.nearestCity, display: cityDisplay, isLoading },
          { label: "Subestação", value: infra.nearestSubstation },
          { label: "Porto", value: infra.nearestPort },
        ].map((item) => (
          <div key={item.label} style={{ padding: 14, borderRadius: 8, background: "rgba(255,255,255,0.08)" }}>
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
