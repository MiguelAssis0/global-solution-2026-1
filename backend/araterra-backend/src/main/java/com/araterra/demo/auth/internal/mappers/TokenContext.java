package com.araterra.demo.auth.internal.mappers;

public class TokenContext {

    private final String accessToken;
    private final String refreshToken;

    public TokenContext(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public String accessToken() {
        return accessToken;
    }

    public String refreshToken() {
        return refreshToken;
    }
}
