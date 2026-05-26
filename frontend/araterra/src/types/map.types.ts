export type LayerName = "roads" | "power" | "agriculturalAreas" | "satellite" | "ndvi";
export type DrawMode = "point" | "polygon" | "idle";
export type StatusType = "loading" | "done" | "error";

export interface LayerStatus {
  key: string;
  message: string;
  type: StatusType;
}

export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
  zoom: number;
}
