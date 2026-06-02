export type AptidaoClass = "alta" | "media" | "baixa";
export type SuitabilityLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ScoreBreakdown {
  roadsScore?: number;
  ndviScore?: number;
  energyScore?: number;
  biomeScore?: number;
  locationScore?: number;
  finalScore: number;
  classification?: AptidaoClass;
  classificationLabel: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weeklyRain: number;
}

export interface LocationContext {
  country: string | null;
  region: string | null;
}

export interface AiBiomeAnalysis {
  name: string | null;
  category: string | null;
  confidence: "HIGH" | "MEDIUM" | "LOW" | null;
}

export interface AiInfrastructureAnalysis {
  name: string | null;
  distanceKm: number | null;
}

export interface AiHighwayAnalysis {
  name: string | null;
  distanceKm: number | null;
  roadType: string | null;
}

export interface AiLocationAnalysis {
  input: {
    latitude: number;
    longitude: number;
  };
  locationContext: LocationContext | null;
  biome: AiBiomeAnalysis | null;
  nearestSubstation: AiInfrastructureAnalysis | null;
  nearestPort: AiInfrastructureAnalysis | null;
  nearestHighway: AiHighwayAnalysis | null;
}

export interface InfraPoint {
  name: string;
  type: string;
  distKm: number;
}

export interface InfraResult {
  nearestCity: InfraPoint | null;
  nearestSubstation: InfraPoint | null;
  nearestPort: InfraPoint | null;
}

export interface RoadsResult {
  count: number;
  names: string[];
}

export interface PointAnalysis {
  id?: string;
  type: "point";
  lat: number;
  lng: number;
  biome: string;
  weather?: WeatherData;
  roads: RoadsResult;
  infra: InfraResult;
  score: ScoreBreakdown;
  aiInsight?: string;
}

export interface PolygonAnalysis {
  id?: string;
  type: "polygon";
  vertices: [number, number][];
  centroidLat: number;
  centroidLng: number;
  areaKm2: number;
  widthKm: number;
  heightKm: number;
  numVertices: number;
  biomes: string[];
  weather?: WeatherData;
  roads: RoadsResult;
  infra: InfraResult;
  score: ScoreBreakdown;
  sampleScores?: AptidaoClass[];
  aiInsight?: string;
}

export type AnalysisResult = PointAnalysis | PolygonAnalysis;

export interface RegionSummaryCharacteristics {
  nearestRoadName?: string;
  nearestRoadDistanceKm?: number;
  nearestInfrastructureName?: string;
  nearestInfrastructureType?: "CITY" | "SUBSTATION" | "FARM" | "SILO" | "LOGISTIC_CENTER";
  nearestInfrastructureDistanceKm?: number;
  vegetationScore?: number;
  areaType?: string;
}

export interface QueryPointResponse {
  latitude: number;
  longitude: number;
  nearestRoadName?: string;
  distanceToRoadKm?: number;
  nearestInfrastructureName?: string;
  nearestInfrastructureType?: "CITY" | "SUBSTATION" | "FARM" | "SILO" | "LOGISTIC_CENTER";
  distanceToInfrastructureKm?: number;
  areaType?: string;
  vegetationIndex?: number;
}

export interface ScoreResponse {
  distanceToRoadKm?: number;
  distanceToInfrastructureKm?: number;
  vegetationScore?: number;
  logisticConnectivityScore?: number;
  energyInfrastructureScore?: number;
  finalScore: number;
  suitabilityLevel: SuitabilityLevel;
  biomeScore?: number;
  locationScore?: number;
}

export interface RegionSummaryResponse {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  score: {
    finalScore: number;
    suitabilityLevel: SuitabilityLevel;
  };
  characteristics: RegionSummaryCharacteristics;
}
