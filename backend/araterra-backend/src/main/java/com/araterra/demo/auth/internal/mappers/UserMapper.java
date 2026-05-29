package com.araterra.demo.auth.internal.mappers;

import com.araterra.demo.auth.internal.DTOs.*;
import com.araterra.demo.auth.internal.DTOs.RefreshToken.RefreshTokenResponseDTO;
import com.araterra.demo.auth.internal.entities.User;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.security.crypto.password.PasswordEncoder;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", expression = "java(user.getId().toString())")
    UserProfileDTO toProfileDTO(User user);

    @Mapping(target = "firstName", source = "name")
    @Mapping(target = "lastName", expression = "java(\"\")")
    @Mapping(target = "password", expression = "java(passwordEncoder.encode(request.password()))")
    @Mapping(target = "role", expression = "java(com.araterra.demo.auth.internal.entities.enums.Roles.USER)")
    @Mapping(target = "status", constant = "true")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "avatarPath", ignore = true)
    @Mapping(target = "theme", ignore = true)
    @Mapping(target = "lastLogin", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "acceptTerms", ignore = true)
    @Mapping(target = "accessibility", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    User toEntity(RegisterRequestDTO request, @Context PasswordEncoder passwordEncoder);

    @Mapping(target = "accessToken", expression = "java(tokens.accessToken())")
    @Mapping(target = "refreshToken", expression = "java(tokens.refreshToken())")
    @Mapping(target = "requiresTwoFactor", constant = "false")
    LoginResponseDTO toLoginDTO(User user, @Context TokenContext tokens);

    @Mapping(target = "token", expression = "java(tokens.accessToken())")
    @Mapping(target = "refreshToken", expression = "java(tokens.refreshToken())")
    RefreshTokenResponseDTO toRefreshTokenDTO(User user, @Context TokenContext tokens);

    @Mapping(target = "theme", source = "theme")
    UserThemeDTO toThemeDTO(User user);
}