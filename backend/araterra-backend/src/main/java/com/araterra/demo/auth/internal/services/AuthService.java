package com.araterra.demo.auth.internal.services;

import com.araterra.demo.auth.internal.DTOs.*;
import com.araterra.demo.auth.internal.DTOs.RefreshToken.RefreshTokenRequestDTO;
import com.araterra.demo.auth.internal.DTOs.RefreshToken.RefreshTokenResponseDTO;
import com.araterra.demo.auth.internal.entities.User;
import com.araterra.demo.auth.internal.entities.enums.Roles;
import com.araterra.demo.auth.internal.mappers.TokenContext;
import com.araterra.demo.auth.internal.mappers.UserMapper;
import com.araterra.demo.auth.internal.repositories.UserRepository;
import com.araterra.demo.shared.infra.exceptions.InvalidCredentialsException;
import com.araterra.demo.shared.infra.exceptions.ResourceAlreadyExistsException;
import com.araterra.demo.shared.infra.services.TokenService;
import com.araterra.demo.shared.infra.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;
    private final UserMapper userMapper;

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
            throw new InvalidCredentialsException("Account inactive");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return userMapper.toLoginDTO(user, new TokenContext(
                tokenService.generateToken(user),
                tokenService.generateRefreshToken(user)
        ));
    }

    public LoginResponseDTO register(RegisterRequestDTO request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new ResourceAlreadyExistsException("Email already in use");
        }

        User user = userMapper.toEntity(request, passwordEncoder);
        userRepository.save(user);

        return userMapper.toLoginDTO(user, new TokenContext(
                tokenService.generateToken(user),
                tokenService.generateRefreshToken(user)
        ));
    }

    public RefreshTokenResponseDTO refreshToken(RefreshTokenRequestDTO request) {

        String email = tokenService.getSubjectFromRefreshToken(request.refreshToken());
        User user = findUser(email);

        if (!user.getStatus()) {
            throw new InvalidCredentialsException("Account inactive");
        }

        return userMapper.toRefreshTokenDTO(user, new TokenContext(
                tokenService.generateToken(user),
                tokenService.generateRefreshToken(user)
        ));
    }

    public UserProfileDTO getProfile(String email) {
        User user = findUser(email);
        return userMapper.toProfileDTO(user);
    }

    public UserProfileDTO updateProfile(String email, UpdateUserProfileDTO request) {
        User user = findUser(email);

        if (request.firstName() != null) {
            user.setFirstName(request.firstName().trim());
        }

        if (request.lastName() != null) {
            user.setLastName(request.lastName().trim());
        }

        if (request.phone() != null) {

            String phone = request.phone().trim();

            if (phone.isEmpty()) {
                user.setPhone(null);
            } else if (!phone.equals(user.getPhone()) && userRepository.existsByPhone(phone)) {
                throw new ResourceAlreadyExistsException("Phone already in use");
            } else {
                user.setPhone(phone);
            }
        }

        userRepository.save(user);

        return userMapper.toProfileDTO(user);
    }

    public UserProfileDTO uploadAvatar(String email, MultipartFile file) {

        User user = findUser(email);

        if (user.getAvatarPath() != null) {
            storageService.delete(user.getAvatarPath());
        }

        String path = storageService.save(file, "avatars");

        user.setAvatarPath(path);

        userRepository.save(user);

        return userMapper.toProfileDTO(user);
    }

    public void changePassword(String email, ChangePasswordRequestDTO request) {

        User user = findUser(email);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid current password");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));

        userRepository.save(user);
    }


    public UserThemeDTO updateUserTheme(String email, UpdateThemeRequestDTO request) {

        User user = findUser(email);
        user.setTheme(request.theme());
        userRepository.save(user);
        return userMapper.toThemeDTO(user);
    }

    public UserThemeDTO getUserTheme(String email) {
        User user = findUser(email);

        return userMapper.toThemeDTO(user);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new InvalidCredentialsException("User not found"));
    }
}
