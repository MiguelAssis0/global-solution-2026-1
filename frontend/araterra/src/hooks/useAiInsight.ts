import { useCallback, useState } from "react";
import { requestInsight } from "../services/aiService";
import { useAnalysisStore } from "../store/analysisStore";

export function useAiInsight() {
  const current = useAnalysisStore((state) => state.current);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestInsightFromBackend = useCallback(async () => {
    if (!current) {
      setError("Selecione uma análise antes de gerar a visão de IA.");
      return;
    }

    const lat = current.type === "point" ? current.lat : current.centroidLat;
    const lng = current.type === "point" ? current.lng : current.centroidLng;

    setLoading(true);
    setError(null);
    try {
      const response = await requestInsight(lat, lng);
      setInsight(response.insight);
    } catch (err) {
      setError("Não foi possível gerar o insight de IA. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [current]);

  return {
    insight,
    loading,
    error,
    requestInsight: requestInsightFromBackend,
    clearInsight: () => setInsight(null),
  };
}
