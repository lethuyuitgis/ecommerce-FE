package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import com.shopcuathuy.exception.UnauthorizedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    // userId -> Set of productIds
    private static final Map<String, Set<String>> wishlists = new ConcurrentHashMap<>();

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistItem>>> getWishlist(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            throw new UnauthorizedException("User not authenticated");
        }

        Set<String> productIds = wishlists.getOrDefault(userId, Collections.emptySet());
        List<WishlistItem> items = productIds.stream()
            .map(productId -> {
                // Get product from ProductController
                ProductController.Product product = ProductController.products.get(productId);
                if (product == null) return null;
                
                WishlistItem item = new WishlistItem();
                item.productId = product.id;
                item.productName = product.name;
                item.productPrice = product.price;
                item.productImage = product.primaryImage;
                item.addedAt = product.createdAt != null ? product.createdAt.toString() : java.time.Instant.now().toString();
                return item;
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WishlistItem>> addToWishlist(
            @RequestBody AddToWishlistRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            throw new UnauthorizedException("User not authenticated");
        }

        // Verify product exists
        ProductController.Product product = ProductController.products.get(request.productId);
        if (product == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Product not found"));
        }

        Set<String> wishlist = wishlists.computeIfAbsent(userId, k -> new HashSet<>());
        wishlist.add(request.productId);

        WishlistItem item = new WishlistItem();
        item.productId = product.id;
        item.productName = product.name;
        item.productPrice = product.price;
        item.productImage = product.primaryImage;
        item.addedAt = java.time.Instant.now().toString();

        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            @PathVariable String productId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            throw new UnauthorizedException("User not authenticated");
        }

        Set<String> wishlist = wishlists.get(userId);
        if (wishlist == null || !wishlist.remove(productId)) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Product not in wishlist"));
        }

        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> checkInWishlist(
            @PathVariable String productId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(false));
        }

        Set<String> wishlist = wishlists.getOrDefault(userId, Collections.emptySet());
        boolean inWishlist = wishlist.contains(productId);
        return ResponseEntity.ok(ApiResponse.success(inWishlist));
    }

    // Inner classes
    public static class AddToWishlistRequest {
        public String productId;
    }

    public static class WishlistItem {
        public String productId;
        public String productName;
        public Double productPrice;
        public String productImage;
        public String addedAt;
    }
}

