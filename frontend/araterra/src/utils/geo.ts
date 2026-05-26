import type { AptidaoClass } from "../types/analysis.types";

export function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calcAreaKm2(vertices: [number, number][]) {
  if (vertices.length < 3) {
    return 0;
  }

  let area = 0;
  const count = vertices.length;
  for (let i = 0; i < count; i += 1) {
    const [x1, y1] = vertices[i];
    const [x2, y2] = vertices[(i + 1) % count];
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area / 2) * 111.32 * 111.32 / 1000;
}

export function getBoundsFromVertices(vertices: [number, number][]) {
  if (!vertices.length) return null;
  const lats = vertices.map(([lat]) => lat);
  const lngs = vertices.map(([, lng]) => lng);
  return {
    south: Math.min(...lats),
    west: Math.min(...lngs),
    north: Math.max(...lats),
    east: Math.max(...lngs),
  };
}

export function getBiome(lat: number, lng: number) {
  const hash = Math.round((Math.abs(lat * 100) + Math.abs(lng * 100)) % 3);
  return ["Floresta Tropical", "Savanna", "Zona Costeira"][hash];
}

export function getClassification(score: number): AptidaoClass {
  if (score >= 70) return "alta";
  if (score >= 40) return "media";
  return "baixa";
}
