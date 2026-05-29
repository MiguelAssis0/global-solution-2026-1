package com.araterra.demo.shared.infra.security;

import com.araterra.demo.shared.infra.services.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthContext {

    private final TokenService tokenService;

    public String getEmail(HttpServletRequest request) {
        String token = tokenService.extractToken(request);
        return tokenService.getSubject(token);
    }
}