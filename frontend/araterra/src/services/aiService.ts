import { api } from "./api";
import type { AiLocationAnalysis, AnalysisResult } from "../types/analysis.types";

interface AiTextResponse {
  message: string | null;
}

const getAnalysisTarget = (analysis: AnalysisResult) => {
  if (analysis.type === "point") {
    return {
      latitude: analysis.lat,
      longitude: analysis.lng,
    };
  }

  return {
    latitude: analysis.centroidLat,
    longitude: analysis.centroidLng,
  };
};

const buildInsightMessage = (analysis: AnalysisResult, aiAnalysis: AiLocationAnalysis | null) =>
  JSON.stringify(
    {
      analysis,
      aiAnalysis,
    },
    null,
    2,
  );

const requestLocationAnalysis = async (lat: number, lng: number) => {
  const response = await api.post<AiLocationAnalysis>("/ai/location-analysis", {
    latitude: lat,
    longitude: lng,
  });

  return response.data;
};

export const requestInsight = async (
  analysis: AnalysisResult,
): Promise<{ insight: string; recommendedUse: string; analysis: AiLocationAnalysis | null }> => {
  const target = getAnalysisTarget(analysis);
  let locationAnalysis: AiLocationAnalysis | null = null;

  try {
    locationAnalysis = await requestLocationAnalysis(target.latitude, target.longitude);
  } catch (err) {
    console.error("[AI Location Analysis Error]", err);
  }

  const response = await api.post<AiTextResponse>("/ai", {
    message: buildInsightMessage(analysis, locationAnalysis),
  });

  return {
    insight: response.data.message?.trim() || "A IA não retornou conteúdo para esta análise.",
    recommendedUse: "AGRICULTURE_AND_LOGISTICS",
    analysis: locationAnalysis,
  };
};
