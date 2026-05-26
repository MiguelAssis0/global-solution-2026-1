import { useCallback } from "react";
import { useMapStore } from "../store/mapStore";
import type { LatLngBoundsExpression } from "leaflet";

function normalizeBounds(bounds: LatLngBoundsExpression) {
  if (!bounds) return null;

  if (Array.isArray(bounds)) {
    const [[south, west], [north, east]] = bounds as [[number, number], [number, number]];
    return { south, west, north, east };
  }

  if (typeof bounds === "object" && "getSouthWest" in bounds && "getNorthEast" in bounds) {
    const southWest = (bounds as any).getSouthWest();
    const northEast = (bounds as any).getNorthEast();
    return {
      south: southWest.lat,
      west: southWest.lng,
      north: northEast.lat,
      east: northEast.lng,
    };
  }

  return null;
}

export function useMapBounds() {
  const setBounds = useMapStore((state) => state.setBounds);

  const handleBoundsChange = useCallback(
    (bounds: LatLngBoundsExpression, zoom: number) => {
      const normalized = normalizeBounds(bounds);
      if (!normalized) return;
      setBounds({ ...normalized, zoom });
    },
    [setBounds],
  );

  return {
    handleBoundsChange,
  };
}
