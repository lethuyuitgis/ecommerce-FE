package com.shopcuathuy.service;

import com.shopcuathuy.controller.AuthController;
import com.shopcuathuy.exception.UnauthorizedException;
import com.shopcuathuy.model.UserData;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private static final Map<String, UserData> users = new ConcurrentHashMap<>();
    private static final Map<String, String> tokens = new ConcurrentHashMap<>();
    private static final Map<String, String> refreshTokens = new ConcurrentHashMap<>();

    static {
        // Initialize default users
        java.time.Instant now = java.time.Instant.now();
        users.put("admin@shopcuathuy.com", new UserData(
            UUID.randomUUID().toString(),
            "admin@shopcuathuy.com",
            "admin123",
            "System Admin",
            "ADMIN",
            now
        ));
        users.put("seller@shopcuathuy.com", new UserData(
            UUID.randomUUID().toString(),
            "seller@shopcuathuy.com",
            "seller123",
            "Default Seller",
            "SELLER",
            now
        ));
        users.put("user1@example.com", new UserData(
            UUID.randomUUID().toString(),
            "user1@example.com",
            "user123",
            "Customer One",
            "CUSTOMER",
            now
        ));
    }

    public AuthController.AuthResponse login(String email, String password) {
        UserData user = users.get(email);
        if (user == null || !user.password.equals(password)) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = generateToken();
        String refreshToken = generateToken();
        
        tokens.put(token, user.userId);
        refreshTokens.put(refreshToken, user.userId);

        return new AuthController.AuthResponse(
            token, refreshToken, user.userId,
            user.email, user.fullName, user.userType
        );
    }

    public AuthController.AuthResponse register(String email, String password, String fullName) {
        com.shopcuathuy.util.ValidationUtil.validateEmail(email);
        com.shopcuathuy.util.ValidationUtil.validatePassword(password);
        
        if (users.containsKey(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required");
        }

        UserData newUser = new UserData(
            UUID.randomUUID().toString(),
            email,
            password,
            fullName,
            "CUSTOMER",
            java.time.Instant.now()
        );

        users.put(email, newUser);

        String token = generateToken();
        String refreshToken = generateToken();
        
        tokens.put(token, newUser.userId);
        refreshTokens.put(refreshToken, newUser.userId);

        return new AuthController.AuthResponse(
            token, refreshToken, newUser.userId,
            newUser.email, newUser.fullName, newUser.userType
        );
    }

    public void logout(String token) {
        tokens.remove(token);
    }

    public AuthController.AuthResponse refreshToken(String refreshToken) {
        String userId = refreshTokens.get(refreshToken);
        if (userId == null) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        UserData user = users.values().stream()
            .filter(u -> u.userId.equals(userId))
            .findFirst()
            .orElseThrow(() -> new UnauthorizedException("User not found"));

        String newToken = generateToken();
        String newRefreshToken = generateToken();
        
        tokens.put(newToken, user.userId);
        refreshTokens.put(newRefreshToken, user.userId);
        refreshTokens.remove(refreshToken);

        return new AuthController.AuthResponse(
            newToken, newRefreshToken, user.userId,
            user.email, user.fullName, user.userType
        );
    }

    public String validateToken(String token) {
        return tokens.get(token);
    }

    private String generateToken() {
        return UUID.randomUUID().toString() + "-" + System.currentTimeMillis();
    }
}

