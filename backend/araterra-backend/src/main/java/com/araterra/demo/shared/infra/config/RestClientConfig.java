package com.araterra.demo.shared.infra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient authRestClient(RestClient.Builder builder) {
        return builder
                .baseUrl("http://localhost:8080")
                .build();
    }

    @Bean
    public RestClient nominatimRestClient(RestClient.Builder builder) {
        return builder
                .baseUrl("https://nominatim.openstreetmap.org")
                .defaultHeader(HttpHeaders.USER_AGENT, "Araterra/1.0")
                .build();
    }
}
