package com.araterra.demo.auth.internal.DTOs;

public record UserProfileDTO(
        String id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String avatarPath,
        String theme
) {
}
