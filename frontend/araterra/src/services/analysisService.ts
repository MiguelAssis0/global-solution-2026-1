import { api } from "./api";
import type { AnalysisResult, InfraResult, RegionSummaryResponse } from "../types/analysis.types";
import { calcAreaKm2, getBoundsFromVertices, getBiome, haversineDistance } from "../utils/geo";

const normalizeId = (result: AnalysisResult) => ({
  ...result,
  id: result.id ?? `analysis-${Date.now()}`,
});

const mapSuitabilityClassifier = (level: RegionSummaryResponse["score"]["suitabilityLevel"]): { classification: "alta" | "media" | "baixa"; classificationLabel: string } => {
  switch (level) {
    case "HIGH":
      return { classification: "alta", classificationLabel: "Alta" };
    case "MEDIUM":
      return { classification: "media", classificationLabel: "Média" };
    default:
      return { classification: "baixa", classificationLabel: "Baixa" };
  }
};

const mapScoreBreakdown = (response: RegionSummaryResponse) => {
  const roadDistance = response.characteristics.nearestRoadDistanceKm ?? 999;
  const infraDistance = response.characteristics.nearestInfrastructureDistanceKm ?? 999;
  const vegetationScore = response.characteristics.vegetationScore ?? 0.4;

  const roadsScore = roadDistance <= 5 ? 100 : roadDistance <= 15 ? 70 : roadDistance <= 30 ? 40 : 10;
  const energyScore = infraDistance <= 10 ? 100 : infraDistance <= 30 ? 70 : infraDistance <= 60 ? 40 : 10;
  const ndviScore = Math.round(Math.min(Math.max(vegetationScore, 0), 1) * 100);

  return {
    finalScore: response.score.finalScore,
    classification: mapSuitabilityClassifier(response.score.suitabilityLevel).classification,
    classificationLabel: mapSuitabilityClassifier(response.score.suitabilityLevel).classificationLabel,
    roadsScore,
    ndviScore,
    energyScore,
  };
};

const mapInfraResult = (characteristics: RegionSummaryResponse["characteristics"]): InfraResult => {
  const base = {
    nearestCity: null,
    nearestSubstation: null,
    nearestPort: null,
  };

  const infrastructureName = characteristics.nearestInfrastructureName;
  const distance = characteristics.nearestInfrastructureDistanceKm;
  const type = characteristics.nearestInfrastructureType;

  if (!infrastructureName || distance == null) {
    return base;
  }

  const point = {
    name: infrastructureName,
    type: type ?? "unknown",
    distKm: distance,
  };

  if (type === "CITY") {
    return { ...base, nearestCity: point };
  }
  if (type === "SUBSTATION") {
    return { ...base, nearestSubstation: point };
  }
  if (type === "PORT") {
    return { ...base, nearestPort: point };
  }

  return base;
};

const mapRegionSummaryToAnalysis = (response: RegionSummaryResponse) => {
  const roads: AnalysisResult["roads"] = {
    count: response.characteristics.nearestRoadName ? 1 : 0,
    names: response.characteristics.nearestRoadName ? [response.characteristics.nearestRoadName] : [],
  };

  return {
    type: "point" as const,
    lat: response.coordinates.latitude,
    lng: response.coordinates.longitude,
    biome: response.characteristics.areaType ?? getBiome(response.coordinates.latitude, response.coordinates.longitude),
    roads,
    infra: mapInfraResult(response.characteristics),
    score: mapScoreBreakdown(response),
    aiInsight: response.ai?.insight,
  };
};

const calculateCentroid = (vertices: [number, number][]): [number, number] => {
  const total = vertices.reduce(
    (acc, [lat, lng]) => ({ lat: acc.lat + lat, lng: acc.lng + lng }),
    { lat: 0, lng: 0 },
  );
  return [total.lat / vertices.length, total.lng / vertices.length];
};

export const analyzePoint = async (lat: number, lng: number): Promise<AnalysisResult> => {
  const response = await api.post<RegionSummaryResponse>("/region-summary", {
    latitude: lat,
    longitude: lng,
    generateAiInsight: false,
  });

  return normalizeId(mapRegionSummaryToAnalysis(response.data));
};

export const analyzePolygon = async (vertices: [number, number][]): Promise<AnalysisResult> => {
  const [centroidLat, centroidLng] = calculateCentroid(vertices);
  const response = await api.post<RegionSummaryResponse>("/region-summary", {
    latitude: centroidLat,
    longitude: centroidLng,
    generateAiInsight: false,
  });

  const bounds = getBoundsFromVertices(vertices);
  const widthKm = bounds ? haversineDistance(bounds.south, bounds.west, bounds.south, bounds.east) : 0;
  const heightKm = bounds ? haversineDistance(bounds.south, bounds.west, bounds.north, bounds.west) : 0;

  return normalizeId({
    ...mapRegionSummaryToAnalysis(response.data),
    type: "polygon",
    vertices,
    centroidLat,
    centroidLng,
    areaKm2: calcAreaKm2(vertices),
    widthKm,
    heightKm,
    numVertices: vertices.length,
    biomes: [response.data.characteristics.areaType ?? getBiome(centroidLat, centroidLng)],
  });
};
