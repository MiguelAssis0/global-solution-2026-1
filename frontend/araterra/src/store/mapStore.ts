import { create } from "zustand";
import type { DrawMode, LayerName, LayerStatus, MapBounds } from "../types/map.types";

interface MapStore {
  drawMode: DrawMode;
  activeLayers: Record<LayerName, boolean>;
  layerStatuses: LayerStatus[];
  bounds: MapBounds | null;
  drawVertices: [number, number][];

  setDrawMode: (mode: DrawMode) => void;
  toggleLayer: (layer: LayerName) => void;
  setBounds: (bounds: MapBounds) => void;
  addVertex: (pt: [number, number]) => void;
  clearVertices: () => void;
  setLayerStatus: (status: LayerStatus) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  drawMode: "idle",
  activeLayers: {
    roads: true,
    power: true,
    agriculturalAreas: true,
    satellite: false,
    ndvi: false,
  },
  layerStatuses: [],
  bounds: null,
  drawVertices: [],

  setDrawMode: (mode) => set((state) => ({ drawMode: mode, drawVertices: mode === "idle" ? [] : state.drawVertices })),
  toggleLayer: (layer) =>
    set((state) => ({ activeLayers: { ...state.activeLayers, [layer]: !state.activeLayers[layer] } })),
  setBounds: (bounds) => set({ bounds }),
  addVertex: (pt) => set((state) => ({ drawVertices: [...state.drawVertices, pt] })),
  clearVertices: () => set({ drawVertices: [] }),
  setLayerStatus: (status) => set((state) => ({ layerStatuses: [...state.layerStatuses, status] })),
}));
