import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateAnalysisScore } from "../services/analysisService";
import { requestInsight } from "../services/aiService";
import { useAnalysisStore } from "../store/analysisStore";
import type { AiLocationAnalysis } from "../types/analysis.types";

export function useAiInsight() {
  const current = useAnalysisStore((state) => state.current);
  const updateCurrent = useAnalysisStore((state) => state.updateCurrent);
  const [insight, setInsight] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AiLocationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enrichedScoreIds = useRef<Set<string>>(new Set());
  const requestedInsightIds = useRef<Set<string>>(new Set());
  const currentKey = useMemo(() => {
    if (!current) return null;
    if (current.id) return current.id;
    return current.type === "point"
      ? `point-${current.lat}-${current.lng}`
      : `polygon-${current.centroidLat}-${current.centroidLng}`;
  }, [current]);

  const requestInsightFromBackend = useCallback(async () => {
    if (!current) {
      setError("Selecione uma análise antes de gerar a visão de IA.");
      setInsight(null);
      setAnalysisData(null);
      return;
    }

    setInsight(null);
    setAnalysisData(null);
    setLoading(true);
    setError(null);
    try {
      const response = await requestInsight(current);
      setInsight(response.insight);
      setAnalysisData(response.analysis);
      if (response.analysis && currentKey && !enrichedScoreIds.current.has(currentKey)) {
        enrichedScoreIds.current.add(currentKey);
        const score = await calculateAnalysisScore(current, response.analysis);
        updateCurrent((analysis) => ({ ...analysis, score }));
      }
    } catch (err) {
      setError("Não foi possível gerar o insight de IA. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [current, currentKey, updateCurrent]);

  useEffect(() => {
    if (!current) {
      setInsight(null);
      setAnalysisData(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (!currentKey || requestedInsightIds.current.has(currentKey)) {
      return;
    }

    setInsight(null);
    setAnalysisData(null);
    setError(null);
    requestedInsightIds.current.add(currentKey);
    void requestInsightFromBackend();
  }, [currentKey, requestInsightFromBackend]);

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
