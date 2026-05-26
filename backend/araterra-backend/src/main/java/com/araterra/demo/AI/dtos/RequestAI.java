package com.araterra.demo.AI.dtos;

import jakarta.validation.constraints.NotBlank;

public record RequestAI(
        @NotBlank
        String message
) {
}
