import type { WeatherData } from "../../../types/analysis.types";

interface WeatherBlockProps {
  weather: WeatherData | undefined;
  loading: boolean;
  error: string | null;
}

const sectionStyle = {
  marginBottom: 18,
  padding: 20,
  borderRadius: 8,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.14)",
};

const metricStyle = {
  padding: 14,
  borderRadius: 8,
  background: "rgba(255,255,255,0.08)",
};

export function WeatherBlock({ weather, loading, error }: WeatherBlockProps) {
  if (loading) {
    return <div style={{ ...sectionStyle }}>Carregando clima...</div>;
  }

  if (error) {
    return (
      <div style={{ ...sectionStyle, background: "rgba(255,107,74,0.12)", color: "var(--color-score-low)" }}>
        {error}
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <section style={sectionStyle}>
      <div style={{ marginBottom: 16, fontWeight: 800 }}>Clima local</div>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={metricStyle}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.84rem" }}>Temperatura</p>
            <p style={{ margin: "8px 0 0", fontSize: "1.12rem", fontWeight: 800 }}>{weather.temperature.toFixed(1)}°C</p>
          </div>
          <div style={metricStyle}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.84rem" }}>Umidade</p>
            <p style={{ margin: "8px 0 0", fontSize: "1.12rem", fontWeight: 800 }}>{weather.humidity}%</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={metricStyle}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.84rem" }}>Vento</p>
            <p style={{ margin: "8px 0 0", fontSize: "1.12rem", fontWeight: 800 }}>{weather.windSpeed.toFixed(1)} m/s</p>
          </div>
          <div style={metricStyle}>
            <p style={{ margin: 0, color: "var(--color-text-2)", fontSize: "0.84rem" }}>Chuvas 7d</p>
            <p style={{ margin: "8px 0 0", fontSize: "1.12rem", fontWeight: 800 }}>{weather.weeklyRain.toFixed(1)} mm</p>
          </div>
        </div>
      </div>
    </section>
  );
}
