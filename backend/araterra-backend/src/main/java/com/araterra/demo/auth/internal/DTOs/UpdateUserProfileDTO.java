package com.araterra.demo.auth.internal.DTOs;

public record UpdateUserProfileDTO(
        String firstName,
        String lastName,
        String phone,
        String avatarPath
) {
}
