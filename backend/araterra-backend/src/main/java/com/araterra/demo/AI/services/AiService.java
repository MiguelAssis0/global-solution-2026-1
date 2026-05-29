package com.araterra.demo.AI.services;


import com.araterra.demo.AI.dtos.LocationAnalysisRequestDTO;
import com.araterra.demo.AI.dtos.LocationAnalysisResponseDTO;
import com.araterra.demo.AI.dtos.RequestAI;
import com.araterra.demo.AI.dtos.ResponseAI;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class AiService {

    private static final String LOCATION_ANALYSIS_PROMPT = """
            You are a geospatial analysis service.

            Given a latitude and longitude, return ONLY a valid JSON object.

            Do not return markdown.
            Do not return explanations.
            Do not wrap the JSON in code blocks.
            Do not include any text before or after the JSON.

            Coordinates:
            latitude: %s
            longitude: %s

            Tasks:
            1. Identify the biome/ecoregion at the location.
            2. Find the nearest electrical substation.
            3. Find the nearest seaport.
            4. Find the nearest major road/highway.

            Required JSON format:

            {
            "input": {
            "latitude": 0.0,
            "longitude": 0.0
            },
            "locationContext": {
            "country": null,
            "region": null
            },
            "biome": {
            "name": null,
            "category": null,
            "confidence": "HIGH"
            },
            "nearestSubstation": {
            "name": null,
            "distanceKm": null
            },
            "nearestPort": {
            "name": null,
            "distanceKm": null
            },
            "nearestHighway": {
            "name": null,
            "distanceKm": null,
            "roadType": null
            }
            }

            Rules:
            - Return everything in portuguese
            - Return only valid JSON.
            - Use null when information cannot be determined.
            - distanceKm must be numeric or null.
            - confidence must be HIGH, MEDIUM, or LOW.
            - Do not invent precise values.
            - Prefer official names.
            - Use kilometers.
            - The biome should correspond to the most likely global biome or ecoregion at the coordinates.
            - The nearest road should be a significant road, highway, motorway, trunk road, expressway, or equivalent.
            """;

    private final ObjectMapper objectMapper;

    @Value("classpath:website-context.txt")
    private Resource contextoResource;

    public ResponseAI generateResponse(RequestAI request) {
        try (Client client = new Client()) {

            String contextText = new String(
                    contextoResource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            Content systemInstruction = Content.fromParts(Part.fromText(contextText));

            GenerateContentConfig config = GenerateContentConfig.builder()
                    .systemInstruction(systemInstruction)
                    .build();

            GenerateContentResponse response = client.models.generateContent(
                    "gemini-3-flash-preview",
                    request.message(),
                    config
            );

            return new ResponseAI(response.text());

        } catch (IOException e) {
            throw new RuntimeException("Error loading context", e);
        }
    }

    public LocationAnalysisResponseDTO generateLocationAnalysis(LocationAnalysisRequestDTO request) {
        try (Client client = new Client()) {
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-3-flash-preview",
                    LOCATION_ANALYSIS_PROMPT.formatted(request.latitude(), request.longitude()),
                    GenerateContentConfig.builder().build()
            );

            String responseText = response.text();
            if (responseText == null || responseText.isBlank()) {
                throw new IllegalArgumentException("Gemini returned an empty response.");
            }
            System.out.println(responseText);
            return objectMapper.readValue(responseText, LocationAnalysisResponseDTO.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Gemini returned an invalid JSON response.", e);
        } catch (IOException e) {
            throw new RuntimeException("Error while requesting Gemini analysis.", e);
        }
    }
}
