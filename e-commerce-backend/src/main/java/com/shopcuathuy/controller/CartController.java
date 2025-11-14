package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    // userId -> List of CartItems
    private static final Map<String, List<CartItem>> carts = new ConcurrentHashMap<>();

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItem>>> getCart(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(Collections.emptyList()));
        }
        
        List<CartItem> cart = carts.getOrDefault(userId, new ArrayList<>());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartItem>> addToCart(
            @RequestBody AddToCartRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        List<CartItem> cart = carts.computeIfAbsent(userId, k -> new ArrayList<>());
        
        // Check if item already exists
        Optional<CartItem> existingItem = cart.stream()
            .filter(item -> item.productId.equals(request.productId) &&
                           Objects.equals(item.variantId, request.variantId))
            .findFirst();

        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.quantity += request.quantity;
        } else {
            cartItem = new CartItem();
            cartItem.id = UUID.randomUUID().toString();
            cartItem.productId = request.productId;
            cartItem.variantId = request.variantId;
            cartItem.quantity = request.quantity;
            cartItem.size = request.size;
            cartItem.color = request.color;
            // Mock product data - in production, fetch from ProductService
            cartItem.productName = "Product " + request.productId;
            cartItem.productPrice = 100000.0;
            cartItem.availableQuantity = 100;
            cart.add(cartItem);
        }

        return ResponseEntity.ok(ApiResponse.success(cartItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CartItem>> updateCartItem(
            @PathVariable String id,
            @RequestBody UpdateCartItemRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        List<CartItem> cart = carts.get(userId);
        if (cart == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Cart not found"));
        }

        CartItem item = cart.stream()
            .filter(i -> i.id.equals(id))
            .findFirst()
            .orElse(null);

        if (item == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Cart item not found"));
        }

        if (request.quantity != null) {
            item.quantity = request.quantity;
        }

        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        List<CartItem> cart = carts.get(userId);
        if (cart == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Cart not found"));
        }

        boolean removed = cart.removeIf(item -> item.id.equals(id));
        if (!removed) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Cart item not found"));
        }

        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Inner classes
    public static class AddToCartRequest {
        public String productId;
        public String variantId;
        public Integer quantity;
        public String size;
        public String color;
    }

    public static class UpdateCartItemRequest {
        public Integer quantity;
    }

    public static class CartItem {
        public String id;
        public String productId;
        public String productName;
        public Double productPrice;
        public String productImage;
        public String variantId;
        public String variantName;
        public Double variantPrice;
        public Integer quantity;
        public Integer availableQuantity;
        public String size;
        public String color;
    }
}

