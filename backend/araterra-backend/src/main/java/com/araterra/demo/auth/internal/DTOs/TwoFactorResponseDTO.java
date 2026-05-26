package com.araterra.demo.auth.internal.DTOs;

public record TwoFactorResponseDTO(
        String accessToken,
        String refreshToken,
        String message
) {
}
