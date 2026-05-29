import { useCallback, useEffect, useState } from "react";
import { requestInsight } from "../services/aiService";
import { useAnalysisStore } from "../store/analysisStore";
import type { AiLocationAnalysis } from "../types/analysis.types";

export function useAiInsight() {
  const current = useAnalysisStore((state) => state.current);
  const [insight, setInsight] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AiLocationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestInsightFromBackend = useCallback(async () => {
    if (!current) {
      setError("Selecione uma análise antes de gerar a visão de IA.");
      setInsight(null);
      setAnalysisData(null);
      return;
    }

    const lat = current.type === "point" ? current.lat : current.centroidLat;
    const lng = current.type === "point" ? current.lng : current.centroidLng;

    setInsight(null);
    setAnalysisData(null);
    setLoading(true);
    setError(null);
    try {
      const response = await requestInsight(lat, lng);
      setInsight(response.insight);
      setAnalysisData(response.analysis);
    } catch (err) {
      setError("Não foi possível gerar o insight de IA. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [current]);

  useEffect(() => {
    if (!current) {
      setInsight(null);
      setAnalysisData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setInsight(null);
    setAnalysisData(null);
    setError(null);
    void requestInsightFromBackend();
  }, [current, requestInsightFromBackend]);

  return {
    insight,
    analysisData,
    loading,
    error,
    requestInsight: requestInsightFromBackend,
    clearInsight: () => {
      setInsight(null);
      setAnalysisData(null);
    },
  };
}
