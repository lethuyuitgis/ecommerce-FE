package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import com.shopcuathuy.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request.email, request.password);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request.email, request.password, request.fullName);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authService.logout(token);
        }
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.refreshToken);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        // Mock Google login - in production, verify idToken with Google
        // For now, create a mock user and register/login
        String email = "google.user@example.com";
        try {
            AuthResponse response = authService.register(email, "google123", "Google User");
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IllegalArgumentException e) {
            // User exists, try login
            AuthResponse response = authService.login(email, "google123");
            return ResponseEntity.ok(ApiResponse.success(response));
        }
    }

    @PostMapping("/facebook")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithFacebook(@RequestBody FacebookLoginRequest request) {
        // Mock Facebook login - in production, verify accessToken with Facebook
        String email = "facebook.user@example.com";
        try {
            AuthResponse response = authService.register(email, "facebook123", "Facebook User");
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (IllegalArgumentException e) {
            // User exists, try login
            AuthResponse response = authService.login(email, "facebook123");
            return ResponseEntity.ok(ApiResponse.success(response));
        }
    }


    // Inner classes for request/response
    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class RegisterRequest {
        public String email;
        public String password;
        public String fullName;
        public String phone;
    }

    public static class RefreshTokenRequest {
        public String refreshToken;
    }

    public static class GoogleLoginRequest {
        public String idToken;
    }

    public static class FacebookLoginRequest {
        public String accessToken;
    }

    public static class AuthResponse {
        public String token;
        public String refreshToken;
        public String userId;
        public String email;
        public String fullName;
        public String userType;

        public AuthResponse(String token, String refreshToken, String userId, 
                          String email, String fullName, String userType) {
            this.token = token;
            this.refreshToken = refreshToken;
            this.userId = userId;
            this.email = email;
            this.fullName = fullName;
            this.userType = userType;
        }
    }

}

