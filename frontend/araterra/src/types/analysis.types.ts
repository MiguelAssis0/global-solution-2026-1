export type AptidaoClass = "alta" | "media" | "baixa";
export type SuitabilityLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ScoreBreakdown {
  roadsScore?: number;
  ndviScore?: number;
  energyScore?: number;
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
  nearestInfrastructureType?: string;
  nearestInfrastructureDistanceKm?: number;
  vegetationScore?: number;
  areaType?: string;
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
  ai?: {
    insight?: string;
    recommendedUse?: string;
  };
}
