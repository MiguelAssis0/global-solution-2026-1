package com.araterra.demo.geospatial.service;

import com.araterra.demo.geospatial.dto.ScoreResponse;
import com.araterra.demo.geospatial.enums.SuitabilityLevel;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AiInsightService {

    @Value("${ai.api-key:}")
    private String apiKey;

    public AiInsightResult generateInsight(double distanceToRoadKm, double distanceToInfrastructureKm, 
                                           double vegetationScore, double finalScore, SuitabilityLevel suitabilityLevel) {
        try {
            if (apiKey == null || apiKey.isEmpty()) {
                return getFallbackInsight();
            }

            String prompt = buildPrompt(distanceToRoadKm, distanceToInfrastructureKm, 
                                        vegetationScore, finalScore, suitabilityLevel);

            try (Client client = new Client()) {
                GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.0-flash-exp",
                    prompt,
                    null
                );

                String insight = response.text();
                String recommendedUse = determineRecommendedUse(suitabilityLevel, insight);

                return new AiInsightResult(insight, recommendedUse);
            }
        } catch (Exception e) {
            return getFallbackInsight();
        }
    }

    private String buildPrompt(double distanceToRoadKm, double distanceToInfrastructureKm, 
                              double vegetationScore, double finalScore, SuitabilityLevel suitabilityLevel) {
        return String.format("""
            Você é um analista geoespacial.
            
            Gere uma análise curta sobre a área selecionada com base nos dados abaixo:
            
            - Distância até estrada: %.2f km
            - Distância até infraestrutura: %.2f km
            - Score de vegetação: %.2f
            - Score final: %.2f
            - Classificação: %s
            
            Explique em linguagem simples:
            1. Por que essa área recebeu essa classificação.
            2. Qual uso é mais recomendado: agricultura, logística ou energia.
            3. Um resumo curto para o painel do usuário.
            
            Não invente dados.
            """, distanceToRoadKm, distanceToInfrastructureKm, vegetationScore, finalScore, suitabilityLevel);
    }

    private String determineRecommendedUse(SuitabilityLevel suitabilityLevel, String insight) {
        if (insight.toLowerCase().contains("logística") || insight.toLowerCase().contains("logistic")) {
            return "LOGISTICS";
        }
        if (insight.toLowerCase().contains("energia") || insight.toLowerCase().contains("energy")) {
            return "ENERGY";
        }
        return "AGRICULTURE_AND_LOGISTICS";
    }

    private AiInsightResult getFallbackInsight() {
        return new AiInsightResult(
            "Não foi possível gerar a análise automática no momento, mas a região foi classificada com base nos dados geoespaciais calculados.",
            "AGRICULTURE_AND_LOGISTICS"
        );
    }

    public record AiInsightResult(String insight, String recommendedUse) {}
}
