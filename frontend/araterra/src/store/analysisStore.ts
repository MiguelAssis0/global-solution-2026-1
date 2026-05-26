import { create } from "zustand";
import type { AnalysisResult } from "../types/analysis.types";

interface AnalysisStore {
  current: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  history: AnalysisResult[];

  setCurrent: (result: AnalysisResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
  clearCurrent: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  current: null,
  isLoading: false,
  error: null,
  history: [],
  setCurrent: (result) => set((state) => ({ current: result, history: [result, ...state.history], error: null })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (err) => set({ error: err }),
  clearCurrent: () => set({ current: null, error: null }),
}));
