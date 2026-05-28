package com.araterra.demo.auth.internal.services;

import com.araterra.demo.auth.internal.DTOs.LoginRequestDTO;
import com.araterra.demo.auth.internal.DTOs.LoginResponseDTO;
import com.araterra.demo.auth.internal.DTOs.RegisterRequestDTO;
import com.araterra.demo.auth.internal.DTOs.UpdateThemeRequestDTO;
import com.araterra.demo.auth.internal.DTOs.UserThemeDTO;
import com.araterra.demo.auth.internal.DTOs.RefreshToken.RefreshTokenRequestDTO;
import com.araterra.demo.auth.internal.DTOs.RefreshToken.RefreshTokenResponseDTO;
import com.araterra.demo.auth.internal.entities.enums.Roles;
import com.araterra.demo.auth.internal.entities.User;
import com.araterra.demo.auth.internal.repositories.UserRepository;
import com.araterra.demo.shared.infra.exceptions.InvalidCredentialsException;
import com.araterra.demo.shared.infra.exceptions.ResourceAlreadyExistsException;
import com.araterra.demo.shared.infra.services.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    public void logout(String token) {
        if (token == null) {
            throw new InvalidCredentialsException("Invalid token");
        }


        tokenService.getExpirationAsLocalDateTime(token);
    }

    public RefreshTokenResponseDTO refreshToken(RefreshTokenRequestDTO request) {
        String email = tokenService.getSubjectFromRefreshToken(request.refreshToken());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!user.getStatus()) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        String newAccessToken = tokenService.generateToken(user);
        String newRefreshToken = tokenService.generateRefreshToken(user);

        return new RefreshTokenResponseDTO(newAccessToken, newRefreshToken);
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequest, String clientIp) {

        Optional<User> userOpt = userRepository.findByEmail(loginRequest.email());

        String dummyHash = "$argon2id$v=19$m=16384,t=2,p=1$abc$def";
        String passwordHash = userOpt.map(User::getPassword).orElse(dummyHash);
        boolean passwordMatches = passwordEncoder.matches(loginRequest.password(), passwordHash);

        if (userOpt.isEmpty() || !passwordMatches) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        User user = userOpt.get();

        if (!user.getStatus()) {
            throw new InvalidCredentialsException("Account is inactive");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = tokenService.generateToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        return new LoginResponseDTO(accessToken, refreshToken, false);
    }

    public LoginResponseDTO register(RegisterRequestDTO registerRequest) {
        String email = registerRequest.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ResourceAlreadyExistsException("Email already registered");
        }

        String[] nameParts = registerRequest.name().trim().split("\\s+", 2);

        User user = new User();
        user.setFirstName(nameParts[0]);
        user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(registerRequest.password()));
        user.setStatus(true);
        user.setAccessibility(false);
        user.setRole(Roles.USER);
        user.setAcceptTerms(true);

        User savedUser = userRepository.save(user);
        String accessToken = tokenService.generateToken(savedUser);
        String refreshToken = tokenService.generateRefreshToken(savedUser);

        return new LoginResponseDTO(accessToken, refreshToken, false);
    }

    public void updateUserTheme(String email, UpdateThemeRequestDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        user.setTheme(request.theme());
        userRepository.save(user);
    }

    public UserThemeDTO getUserTheme(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        return new UserThemeDTO(user.getTheme() != null ? user.getTheme() : "system");
    }

    public UserThemeDTO updateUserTheme(String email, UserThemeDTO userTheme) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        user.setTheme(userTheme.theme());
        userRepository.save(user);

        return new UserThemeDTO(user.getTheme());
    }
}
