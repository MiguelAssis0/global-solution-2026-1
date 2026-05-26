package com.araterra.demo.auth.internal.DTOs;

public record LoginResponseDTO(
        String accessToken,
        String refreshToken,
        boolean requiresTwoFactor
) {
}
