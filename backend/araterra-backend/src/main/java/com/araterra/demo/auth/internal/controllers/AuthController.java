package com.araterra.demo.auth.internal.controllers;


import com.araterra.demo.auth.internal.DTOs.LoginRequestDTO;
import com.araterra.demo.auth.internal.DTOs.LoginResponseDTO;
import com.araterra.demo.auth.internal.DTOs.RegisterRequestDTO;
import com.araterra.demo.auth.internal.DTOs.RefreshToken.RefreshTokenRequestDTO;
import com.araterra.demo.auth.internal.DTOs.RefreshToken.RefreshTokenResponseDTO;
import com.araterra.demo.auth.internal.services.AuthService;
import com.araterra.demo.shared.infra.services.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private TokenService tokenService;

    @Operation(summary = "Employee Login", description = "Authenticate employee with email and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "429", description = "Too many attempts - blocked"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody @Valid LoginRequestDTO loginRequest,
            HttpServletRequest httpRequest) {

        String clientIp = getClientIp(httpRequest);
        LoginResponseDTO response = authService.login(loginRequest, clientIp);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Register", description = "Create a new user account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registration successful"),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already registered")
    })
    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(@RequestBody @Valid RegisterRequestDTO registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @Operation(summary = "Logout", description = "Invalidate current access token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Logout successful"),
            @ApiResponse(responseCode = "401", description = "Invalid token")
    })
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        String token = tokenService.extractToken(request);
        authService.logout(token);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Refresh Token", description = "Generate new access token using refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successful"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    })
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponseDTO> refresh(@RequestBody @Valid RefreshTokenRequestDTO request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }
}
