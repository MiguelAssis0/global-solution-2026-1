import type { WeatherData } from "../../../types/analysis.types";

interface WeatherBlockProps {
  weather: WeatherData | undefined;
  loading: boolean;
  error: string | null;
}

export function WeatherBlock({ weather, loading, error }: WeatherBlockProps) {
  if (loading) {
    return <div style={{ padding: 20, borderRadius: 20, background: "rgba(255,255,255,0.05)", marginBottom: 24 }}>Carregando clima...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, borderRadius: 20, background: "rgba(255,0,0,0.08)", color: "var(--color-score-low)", marginBottom: 24 }}>{error}</div>;
  }

  if (!weather) {
    return null;
  }

  return (
    <section style={{ marginBottom: 24, padding: 20, borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ marginBottom: 16, fontWeight: 700 }}>Clima local</div>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.04)" }}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.85rem" }}>Temperatura</p>
            <p style={{ margin: "8px 0 0", fontSize: "1.2rem" }}>{weather.temperature.toFixed(1)}°C</p>
          </div>
          <div style={{ padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.04)" }}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.85rem" }}>Umidade</p>
            <p style={{ margin: "8px 0 0", fontSize: "1.2rem" }}>{weather.humidity}%</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.04)" }}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.85rem" }}>Vento</p>
            <p style={{ margin: "8px 0 0", fontSize: "1.2rem" }}>{weather.windSpeed.toFixed(1)} m/s</p>
          </div>
          <div style={{ padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.04)" }}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.85rem" }}>Chuvas 7d</p>
            <p style={{ margin: "8px 0 0", fontSize: "1.2rem" }}>{weather.weeklyRain.toFixed(1)} mm</p>
          </div>
        </div>
      </div>
    </section>
  );
}
