import { create } from "zustand";
import type { AnalysisResult } from "../types/analysis.types";

interface AnalysisStore {
  current: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  history: AnalysisResult[];

  setCurrent: (result: AnalysisResult) => void;
  updateCurrent: (updater: (result: AnalysisResult) => AnalysisResult) => void;
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
  updateCurrent: (updater) => set((state) => {
    if (!state.current) return state;
    const current = updater(state.current);
    return { current, history: [current, ...state.history.filter((item) => item.id !== current.id)] };
  }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (err) => set({ error: err }),
  clearCurrent: () => set({ current: null, error: null }),
}));
