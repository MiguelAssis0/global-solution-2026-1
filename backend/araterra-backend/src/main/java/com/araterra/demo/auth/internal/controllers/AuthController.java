package com.araterra.demo.auth.internal.controllers;

import com.araterra.demo.auth.internal.DTOs.*;
import com.araterra.demo.auth.internal.DTOs.RefreshToken.RefreshTokenRequestDTO;
import com.araterra.demo.auth.internal.DTOs.RefreshToken.RefreshTokenResponseDTO;
import com.araterra.demo.auth.internal.services.AuthService;
import com.araterra.demo.shared.infra.security.AuthContext;
import com.araterra.demo.shared.infra.services.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;
    private final AuthContext authContext;


    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody @Valid LoginRequestDTO loginRequest,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                authService.login(
                        loginRequest,
                        request.getRemoteAddr()
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(
            @RequestBody @Valid RegisterRequestDTO registerRequest
    ) {
        return ResponseEntity.ok(
                authService.register(registerRequest)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponseDTO> refresh(
            @RequestBody @Valid RefreshTokenRequestDTO request
    ) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getProfile(
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                authService.getProfile(
                        authContext.getEmail(request)
                )
        );
    }

    @PatchMapping("/me")
    public ResponseEntity<UserProfileDTO> updateProfile(
            HttpServletRequest request,
            @RequestBody @Valid UpdateUserProfileDTO dto
    ) {
        return ResponseEntity.ok(
                authService.updateProfile(
                        authContext.getEmail(request),
                        dto
                )
        );
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            HttpServletRequest request,
            @RequestBody @Valid ChangePasswordRequestDTO dto
    ) {
        authService.changePassword(
                authContext.getEmail(request),
                dto
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user-theme")
    public ResponseEntity<UserThemeDTO> getUserTheme(
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                authService.getUserTheme(
                        authContext.getEmail(request)
                )
        );
    }


    @PatchMapping("/user-theme")
    public ResponseEntity<UserThemeDTO> updateUserTheme(
            HttpServletRequest request,
            @RequestBody @Valid UpdateThemeRequestDTO dto
    ) {
        return ResponseEntity.ok(
                authService.updateUserTheme(
                        authContext.getEmail(request),
                        dto
                )
        );
    }
}
