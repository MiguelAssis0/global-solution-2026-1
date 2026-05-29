import type { AnalysisResult, WeatherData } from "../../../types/analysis.types";
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
  insightLoading,
  insightError,
  onGenerateInsight,
}: SidebarProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.heading}>
        <p>Painel de análise</p>
        <span>Selecione uma área para consolidar score, clima e contexto.</span>
      </div>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : null}
      {analysis ? (
        <>
          <ScoreBlock result={analysis} loading={loading} />
          <WeatherBlock weather={weather} loading={weatherLoading} error={weatherError} />
          <InfraBlock infra={analysis.infra} analysis={analysis} />
          <AreaStatsBlock analysis={analysis} />
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
