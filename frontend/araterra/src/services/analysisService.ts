import { api } from "./api";
import type { AiLocationAnalysis, AnalysisResult, InfraResult, QueryPointResponse, RegionSummaryResponse, ScoreBreakdown, ScoreResponse } from "../types/analysis.types";
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

const mapScoreResponse = (response: ScoreResponse): ScoreBreakdown => {
  const classifier = mapSuitabilityClassifier(response.suitabilityLevel);
  return {
    finalScore: normalizeFinalScore(response.finalScore),
    classification: classifier.classification,
    classificationLabel: classifier.classificationLabel,
    roadsScore: response.logisticConnectivityScore != null ? Math.round(response.logisticConnectivityScore) : undefined,
    ndviScore: response.vegetationScore != null ? Math.round(response.vegetationScore) : undefined,
    energyScore: response.energyInfrastructureScore != null ? Math.round(response.energyInfrastructureScore) : undefined,
    biomeScore: response.biomeScore,
    locationScore: response.locationScore,
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

const mapRegionSummaryToAnalysis = (response: RegionSummaryResponse, score: ScoreResponse) => {
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
    score: mapScoreResponse(score),
  };
};

const mapQueryPointToAnalysis = (response: QueryPointResponse, score: ScoreResponse): AnalysisResult => {
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
    score: mapScoreResponse(score),
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
  const request = { latitude: lat, longitude: lng };
  const [queryResponse, scoreResponse] = await Promise.all([
    api.post<QueryPointResponse>("/analysis/query-point", request),
    api.post<ScoreResponse>("/analysis/score", request),
  ]);

  return normalizeId(mapQueryPointToAnalysis(queryResponse.data, scoreResponse.data));
};

export const analyzePolygon = async (vertices: [number, number][]): Promise<AnalysisResult> => {
  const [centroidLat, centroidLng] = calculateCentroid(vertices);
  const regionRequest = {
    latitude: centroidLat,
    longitude: centroidLng,
    generateAiInsight: false,
  };
  const scoreRequest = {
    latitude: centroidLat,
    longitude: centroidLng,
  };
  const [response, scoreResponse] = await Promise.all([
    api.post<RegionSummaryResponse>("/region-summary", regionRequest),
    api.post<ScoreResponse>("/analysis/score", scoreRequest),
  ]);

  const bounds = getBoundsFromVertices(vertices);
  const widthKm = bounds ? haversineDistance(bounds.south, bounds.west, bounds.south, bounds.east) : 0;
  const heightKm = bounds ? haversineDistance(bounds.south, bounds.west, bounds.north, bounds.west) : 0;

  return normalizeId({
    ...mapRegionSummaryToAnalysis(response.data, scoreResponse.data),
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

export const calculateAnalysisScore = async (
  analysis: AnalysisResult,
  aiAnalysis?: AiLocationAnalysis | null,
): Promise<ScoreBreakdown> => {
  const latitude = analysis.type === "point" ? analysis.lat : analysis.centroidLat;
  const longitude = analysis.type === "point" ? analysis.lng : analysis.centroidLng;
  const response = await api.post<ScoreResponse>("/analysis/score", {
    latitude,
    longitude,
    aiAnalysis,
  });

  return mapScoreResponse(response.data);
};
