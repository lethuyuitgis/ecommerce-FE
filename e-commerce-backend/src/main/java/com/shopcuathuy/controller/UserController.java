package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/users")
public class UserController {

    // userId -> UserProfile
    private static final Map<String, UserProfile> profiles = new ConcurrentHashMap<>();

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfile>> getProfile(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        UserProfile profile = profiles.computeIfAbsent(userId, k -> {
            UserProfile p = new UserProfile();
            p.id = userId;
            p.email = "user" + userId + "@example.com";
            p.fullName = "User " + userId;
            p.phone = null;
            p.avatar = null;
            return p;
        });

        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfile>> updateProfile(
            @RequestBody UpdateProfileRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        UserProfile profile = profiles.computeIfAbsent(userId, k -> {
            UserProfile p = new UserProfile();
            p.id = userId;
            return p;
        });

        if (request.fullName != null) profile.fullName = request.fullName;
        if (request.phone != null) profile.phone = request.phone;
        if (request.avatar != null) profile.avatar = request.avatar;
        if (request.address != null) profile.address = request.address;

        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    // Inner classes
    public static class UserProfile {
        public String id;
        public String email;
        public String fullName;
        public String phone;
        public String avatar;
        public Map<String, String> address;
    }

    public static class UpdateProfileRequest {
        public String fullName;
        public String phone;
        public String avatar;
        public Map<String, String> address;
    }
}

