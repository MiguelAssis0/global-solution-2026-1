import { api } from "./api";
import type { AnalysisResult, InfraResult, QueryPointResponse, RegionSummaryResponse } from "../types/analysis.types";
import { calcAreaKm2, getBoundsFromVertices, getBiome, haversineDistance } from "../utils/geo";

const normalizeId = (result: AnalysisResult) => ({
  ...result,
  id: result.id ?? `analysis-${Date.now()}`,
});

const normalizeFinalScore = (score: number) => (score <= 1 ? score * 100 : score);

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
  const finalScore = normalizeFinalScore(response.score.finalScore);

  return {
    finalScore,
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
  if (type === "LOGISTIC_CENTER") {
    return { ...base, nearestPort: point };
  }

  return base;
};

const mapQueryPointInfraResult = (response: QueryPointResponse): InfraResult => {
  const base = {
    nearestCity: null,
    nearestSubstation: null,
    nearestPort: null,
  };

  if (!response.nearestInfrastructureName || response.distanceToInfrastructureKm == null) {
    return base;
  }

  const point = {
    name: response.nearestInfrastructureName,
    type: response.nearestInfrastructureType ?? "unknown",
    distKm: response.distanceToInfrastructureKm,
  };

  if (response.nearestInfrastructureType === "CITY") {
    return { ...base, nearestCity: point };
  }
  if (response.nearestInfrastructureType === "SUBSTATION") {
    return { ...base, nearestSubstation: point };
  }
  if (response.nearestInfrastructureType === "LOGISTIC_CENTER") {
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
  };
};

const mapQueryPointToAnalysis = (response: QueryPointResponse): AnalysisResult => {
  const roadDistance = response.distanceToRoadKm ?? 0;
  const infraDistance = response.distanceToInfrastructureKm ?? 0;
  const vegetationIndex = response.vegetationIndex ?? 0.4;

  return {
    type: "point",
    lat: response.latitude,
    lng: response.longitude,
    biome: response.areaType ?? getBiome(response.latitude, response.longitude),
    roads: {
      count: response.nearestRoadName ? 1 : 0,
      names: response.nearestRoadName ? [response.nearestRoadName] : [],
    },
    infra: mapQueryPointInfraResult(response),
    score: {
      finalScore: (
        (roadDistance <= 5 ? 100 : roadDistance <= 15 ? 70 : roadDistance <= 30 ? 40 : 10) * 0.4
        + Math.round(Math.min(Math.max(vegetationIndex, 0), 1) * 100) * 0.3
        + (infraDistance <= 10 ? 100 : infraDistance <= 30 ? 70 : infraDistance <= 60 ? 40 : 10) * 0.3
      ),
      classification:
        roadDistance <= 5 && infraDistance <= 10 ? "alta" : roadDistance <= 30 && infraDistance <= 60 ? "media" : "baixa",
      classificationLabel:
        roadDistance <= 5 && infraDistance <= 10 ? "Alta" : roadDistance <= 30 && infraDistance <= 60 ? "Média" : "Baixa",
      roadsScore: roadDistance <= 5 ? 100 : roadDistance <= 15 ? 70 : roadDistance <= 30 ? 40 : 10,
      energyScore: infraDistance <= 10 ? 100 : infraDistance <= 30 ? 70 : infraDistance <= 60 ? 40 : 10,
      ndviScore: Math.round(Math.min(Math.max(vegetationIndex, 0), 1) * 100),
    },
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
  const response = await api.post<QueryPointResponse>("/analysis/query-point", {
    latitude: lat,
    longitude: lng,
  });

  return normalizeId(mapQueryPointToAnalysis(response.data));
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
