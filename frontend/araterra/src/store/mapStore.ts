import { create } from "zustand";
import type { DrawMode, LayerName, LayerStatus, MapBounds } from "../types/map.types";

interface MapStore {
  drawMode: DrawMode;
  activeLayers: Record<LayerName, boolean>;
  layerStatuses: LayerStatus[];
  bounds: MapBounds | null;
  drawVertices: [number, number][];
  mousePosition: [number, number] | null;
  completedPolygons: [number, number][][];
  selectedPoint: [number, number] | null;

  setDrawMode: (mode: DrawMode) => void;
  toggleLayer: (layer: LayerName) => void;
  setBounds: (bounds: MapBounds) => void;
  addVertex: (pt: [number, number]) => void;
  removeLastVertex: () => void;
  clearVertices: () => void;
  setLayerStatus: (status: LayerStatus) => void;
  setMousePosition: (pos: [number, number] | null) => void;
  addCompletedPolygon: (vertices: [number, number][]) => void;
  clearCompletedPolygons: () => void;
  setSelectedPoint: (point: [number, number] | null) => void;
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
  mousePosition: null,
  completedPolygons: [],
  selectedPoint: null,

  setDrawMode: (mode) => set((state) => ({ drawMode: mode, drawVertices: mode === "idle" ? [] : state.drawVertices, mousePosition: null })),
  toggleLayer: (layer) =>
    set((state) => ({ activeLayers: { ...state.activeLayers, [layer]: !state.activeLayers[layer] } })),
  setBounds: (bounds) => set({ bounds }),
  addVertex: (pt) => set((state) => ({ drawVertices: [...state.drawVertices, pt] })),
  removeLastVertex: () => set((state) => ({ drawVertices: state.drawVertices.slice(0, -1) })),
  clearVertices: () => set({ drawVertices: [], mousePosition: null }),
  setLayerStatus: (status) => set((state) => ({ layerStatuses: [...state.layerStatuses, status] })),
  setMousePosition: (pos) => set({ mousePosition: pos }),
  addCompletedPolygon: (vertices) => set((state) => ({ completedPolygons: [...state.completedPolygons, vertices] })),
  clearCompletedPolygons: () => set({ completedPolygons: [] }),
  setSelectedPoint: (point) => set({ selectedPoint: point }),
}));
