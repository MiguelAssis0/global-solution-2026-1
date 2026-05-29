import { api } from "./api";
import type { AiLocationAnalysis } from "../types/analysis.types";

function formatDistance(distanceKm: number | null | undefined) {
  if (distanceKm == null || Number.isNaN(distanceKm)) {
    return "não identificado";
  }

  return `${distanceKm.toFixed(distanceKm >= 10 ? 0 : 1)} km`;
}

function buildInsight(analysis: AiLocationAnalysis) {
  const biomeName = analysis.biome?.name ?? "Bioma não identificado";
  const biomeCategory = analysis.biome?.category ?? "categoria indisponível";
  const confidence = analysis.biome?.confidence ?? "LOW";
  const region = analysis.locationContext?.region ?? "Região não identificada";
  const country = analysis.locationContext?.country ?? "país não identificado";
  const substation = analysis.nearestSubstation?.name ?? "Subestação não identificada";
  const port = analysis.nearestPort?.name ?? "Porto não identificado";
  const highway = analysis.nearestHighway?.name ?? "Rodovia não identificada";

  return [
    `### Contexto territorial`,
    `- Bioma: **${biomeName}**`,
    `- Categoria: **${biomeCategory}**`,
    `- Confiança da classificação: **${confidence}**`,
    `- Localização: **${region}**, **${country}**`,
    ``,
    `### Infraestrutura próxima`,
    `- Subestação: **${substation}** (${formatDistance(analysis.nearestSubstation?.distanceKm)})`,
    `- Porto: **${port}** (${formatDistance(analysis.nearestPort?.distanceKm)})`,
    `- Rodovia principal: **${highway}** (${formatDistance(analysis.nearestHighway?.distanceKm)})`,
  ].join("\n");
}

export const requestInsight = async (
  lat: number,
  lng: number,
): Promise<{ insight: string; recommendedUse: string; analysis: AiLocationAnalysis }> => {
  const response = await api.post<AiLocationAnalysis>("/ai/location-analysis", {
    latitude: lat,
    longitude: lng,
  });

  return {
    insight: buildInsight(response.data),
    recommendedUse: "AGRICULTURE_AND_LOGISTICS",
    analysis: response.data,
  };
};
