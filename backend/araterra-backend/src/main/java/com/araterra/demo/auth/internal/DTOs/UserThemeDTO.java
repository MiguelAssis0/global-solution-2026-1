package com.araterra.demo.auth.internal.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UserThemeDTO(
        @NotBlank(message = "Theme is required")
        @Pattern(regexp = "light|dark|system", message = "Theme must be light, dark, or system")
        String theme
) {
}
