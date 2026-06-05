import { useState } from "react";
import { Download } from "lucide-react";
import type { AiLocationAnalysis, AnalysisResult, WeatherData } from "../../../types/analysis.types";
import { exportAnalysisPdf } from "../../../utils/exportAnalysisPdf";
import { useCityInfo } from "../../../hooks/useCityInfo";
import { AiInsightBlock } from "../../analysis/AiInsightBlock/AiInsightBlock";
import { AreaStatsBlock } from "../../analysis/AreaStatsBlock/AreaStatsBlock";
import { EmptyState } from "../../analysis/EmptyState/EmptyState";
import { InfraBlock } from "../../analysis/InfraBlock/InfraBlock";
import { ScoreBlock } from "../../analysis/ScoreBlock/ScoreBlock";
import { WeatherBlock } from "../../analysis/WeatherBlock/WeatherBlock";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  analysis: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  weather: WeatherData | undefined;
  weatherLoading: boolean;
  weatherError: string | null;
  insight: string | null;
  aiAnalysis: AiLocationAnalysis | null;
  insightLoading: boolean;
  insightError: string | null;
  onGenerateInsight: () => void;
}

export function Sidebar({
  analysis,
  loading,
  error,
  weather,
  weatherLoading,
  weatherError,
  insight,
  aiAnalysis,
  insightLoading,
  insightError,
  onGenerateInsight,
}: SidebarProps) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const location = analysis
    ? analysis.type === "point"
      ? { lat: analysis.lat, lng: analysis.lng }
      : { lat: analysis.centroidLat, lng: analysis.centroidLng }
    : { lat: undefined, lng: undefined };
  const city = useCityInfo({
    lat: location.lat,
    lng: location.lng,
    enabled: Boolean(analysis),
  });

  const handleExport = async () => {
    if (!analysis || exporting) return;

    setExporting(true);
    setExportError(null);
    try {
      await exportAnalysisPdf({
        analysis,
        weather,
        insight,
        aiAnalysis,
        cityInfo: city.cityInfo,
      });
    } catch {
      setExportError("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.heading}>
        <div className={styles.headingRow}>
          <p>Painel de análise</p>
          <button
            type="button"
            className={styles.shareButton}
            onClick={handleExport}
            disabled={!analysis || loading || weatherLoading || insightLoading || city.isLoading || exporting}
            aria-label="Exportar análise em PDF"
          >
            <Download size={16} aria-hidden="true" />
            {exporting ? "Gerando..." : "Compartilhar"}
          </button>
        </div>
        <span>Selecione uma área para consolidar score, clima e contexto.</span>
      </div>
      {exportError ? <div className={styles.error}>{exportError}</div> : null}
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : null}
      {analysis ? (
        <>
          <ScoreBlock result={analysis} loading={loading} />
          <WeatherBlock weather={weather} loading={weatherLoading} error={weatherError} />
          <InfraBlock
            infra={analysis.infra}
            aiAnalysis={aiAnalysis}
            cityInfo={city.cityInfo}
            cityLoading={city.isLoading}
          />
          <AreaStatsBlock analysis={analysis} aiAnalysis={aiAnalysis} />
          <AiInsightBlock
            insight={insight}
            loading={insightLoading}
            error={insightError}
            onGenerate={onGenerateInsight}
          />
        </>
      ) : (
        <EmptyState loading={loading} />
      )}
    </div>
  );
}
