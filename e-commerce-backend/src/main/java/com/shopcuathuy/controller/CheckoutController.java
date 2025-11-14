package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    @PostMapping
    public ResponseEntity<ApiResponse<CheckoutResponse>> checkout(
            @RequestBody CheckoutRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        // Validate checkout data
        if (request.items == null || request.items.isEmpty()) {
            return ResponseEntity.status(400)
                .body(ApiResponse.error("Cart is empty"));
        }

        if (request.shippingAddressId == null || request.shippingAddressId.isEmpty()) {
            return ResponseEntity.status(400)
                .body(ApiResponse.error("Shipping address is required"));
        }

        if (request.paymentMethod == null || request.paymentMethod.isEmpty()) {
            return ResponseEntity.status(400)
                .body(ApiResponse.error("Payment method is required"));
        }

        // Calculate totals
        double subtotal = 0.0;
        for (CheckoutItem item : request.items) {
            subtotal += item.price * item.quantity;
        }

        double discountAmount = 0.0;
        // Apply voucher if provided
        if (request.voucherCode != null && !request.voucherCode.isEmpty()) {
            // Mock voucher discount - in production, validate and calculate from voucher
            discountAmount = subtotal * 0.1; // 10% discount
        }

        double shippingFee = calculateShippingFee(request.shippingAddressId);
        double tax = subtotal * 0.1; // 10% tax
        double finalTotal = subtotal - discountAmount + shippingFee + tax;

        CheckoutResponse response = new CheckoutResponse();
        response.subtotal = subtotal;
        response.discountAmount = discountAmount;
        response.shippingFee = shippingFee;
        response.tax = tax;
        response.finalTotal = finalTotal;
        response.orderId = UUID.randomUUID().toString();
        response.orderNumber = "ORD" + System.currentTimeMillis();
        response.paymentUrl = "/payment/" + response.orderId; // Mock payment URL

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CheckoutValidationResponse>> validateCheckout(
            @RequestBody CheckoutRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        CheckoutValidationResponse validation = new CheckoutValidationResponse();
        validation.valid = true;
        validation.errors = new ArrayList<>();

        if (userId == null || userId.isEmpty()) {
            validation.valid = false;
            validation.errors.add("User not authenticated");
        }

        if (request.items == null || request.items.isEmpty()) {
            validation.valid = false;
            validation.errors.add("Cart is empty");
        }

        if (request.shippingAddressId == null || request.shippingAddressId.isEmpty()) {
            validation.valid = false;
            validation.errors.add("Shipping address is required");
        }

        if (request.paymentMethod == null || request.paymentMethod.isEmpty()) {
            validation.valid = false;
            validation.errors.add("Payment method is required");
        }

        // Validate product availability
        for (CheckoutItem item : request.items) {
            if (item.quantity <= 0) {
                validation.valid = false;
                validation.errors.add("Invalid quantity for product: " + item.productId);
            }
            // In production, check stock availability
        }

        return ResponseEntity.ok(ApiResponse.success(validation));
    }

    private double calculateShippingFee(String addressId) {
        // Mock shipping fee calculation
        // In production, calculate based on address, weight, shipping method
        return 30000.0;
    }

    // Inner classes
    public static class CheckoutRequest {
        public List<CheckoutItem> items;
        public String shippingAddressId;
        public String paymentMethod;
        public String voucherCode;
        public String notes;
    }

    public static class CheckoutItem {
        public String productId;
        public String variantId;
        public Integer quantity;
        public Double price;
    }

    public static class CheckoutResponse {
        public Double subtotal;
        public Double discountAmount;
        public Double shippingFee;
        public Double tax;
        public Double finalTotal;
        public String orderId;
        public String orderNumber;
        public String paymentUrl;
    }

    public static class CheckoutValidationResponse {
        public Boolean valid;
        public List<String> errors;
    }
}

