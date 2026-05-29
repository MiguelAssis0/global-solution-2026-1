package com.araterra.demo.auth.internal.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequestDTO(
        @NotBlank(message = "Senha atual é obrigatória")
        String currentPassword,

        @NotBlank(message = "Nova senha é obrigatória")
        @Size(min = 6, message = "A nova senha deve ter ao menos 6 caracteres")
        String newPassword
) {
}
