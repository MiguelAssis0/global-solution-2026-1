import { useCallback } from "react";
import { analyzePoint, analyzePolygon } from "../services/analysisService";
import { useAnalysisStore } from "../store/analysisStore";

export function useAnalysis() {
  const current = useAnalysisStore((state) => state.current);
  const isLoading = useAnalysisStore((state) => state.isLoading);
  const error = useAnalysisStore((state) => state.error);
  const setCurrent = useAnalysisStore((state) => state.setCurrent);
  const setLoading = useAnalysisStore((state) => state.setLoading);
  const setError = useAnalysisStore((state) => state.setError);

  const runPointAnalysis = useCallback(
    async (lat: number, lng: number) => {
      try {
        setLoading(true);
        const result = await analyzePoint(lat, lng);
        setCurrent(result);
      } catch (err) {
        setError("Não foi possível analisar o ponto. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [setCurrent, setError, setLoading],
  );

  const runPolygonAnalysis = useCallback(
    async (vertices: [number, number][]) => {
      try {
        setLoading(true);
        const result = await analyzePolygon(vertices);
        setCurrent(result);
      } catch (err) {
        setError("Não foi possível analisar a área. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [setCurrent, setError, setLoading],
  );

  return {
    current,
    isLoading,
    error,
    runPointAnalysis,
    runPolygonAnalysis,
    clearCurrent: () => useAnalysisStore.getState().clearCurrent(),
  };
}
