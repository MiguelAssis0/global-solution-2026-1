export function formatCoords(lat: number, lng: number) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export function formatArea(areaKm2: number) {
  return `${areaKm2.toFixed(2)} km²`;
}

export function formatDistance(distKm: number) {
  return `${distKm.toFixed(1)} km`;
}

export function formatScore(score: number) {
  return `${score.toFixed(0)}`;
}
