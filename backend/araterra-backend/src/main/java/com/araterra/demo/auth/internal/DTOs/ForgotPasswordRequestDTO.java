package com.araterra.demo.auth.internal.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequestDTO(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email")
        String email
) {
}
