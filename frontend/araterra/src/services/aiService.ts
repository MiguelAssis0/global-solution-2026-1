import { api } from "./api";

interface AiResponse {
  message: string;
}

export const requestInsight = async (lat: number, lng: number): Promise<{ insight: string; recommendedUse: string }> => {
  const response = await api.post<AiResponse>("/ai", {
    message: `Por favor, gere uma análise geoespacial em formato Markdown para as coordenadas latitude ${lat}, longitude ${lng}. Use cabeçalhos, listas e parágrafos curtos.`,
  });

  return {
    insight: response.data.message ?? "Não foi possível gerar o insight de IA.",
    recommendedUse: "AGRICULTURE_AND_LOGISTICS",
  };
};
