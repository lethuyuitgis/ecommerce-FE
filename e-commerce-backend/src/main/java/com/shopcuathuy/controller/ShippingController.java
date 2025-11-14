package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    private static final Map<String, ShippingMethod> shippingMethods = new ConcurrentHashMap<>();
    private static final Map<String, List<ShippingAddress>> userAddresses = new ConcurrentHashMap<>();

    static {
        seedShippingMethods();
    }

    @GetMapping("/methods")
    public ResponseEntity<ApiResponse<List<ShippingMethod>>> getShippingMethods() {
        List<ShippingMethod> methods = new ArrayList<>(shippingMethods.values());
        methods.sort(Comparator.comparing(m -> m.displayOrder != null ? m.displayOrder : 0));
        return ResponseEntity.ok(ApiResponse.success(methods));
    }

    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<ShippingCalculation>> calculateShipping(
            @RequestBody ShippingCalculationRequest request) {
        
        ShippingMethod method = shippingMethods.get(request.methodId);
        if (method == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Shipping method not found"));
        }

        // Calculate shipping fee based on weight, distance, etc.
        double baseFee = method.baseFee != null ? method.baseFee : 30000.0;
        double weightFee = request.weight != null ? request.weight * 5000 : 0;
        double distanceFee = request.distance != null ? request.distance * 1000 : 0;
        double totalFee = baseFee + weightFee + distanceFee;

        ShippingCalculation calculation = new ShippingCalculation();
        calculation.methodId = method.id;
        calculation.methodName = method.name;
        calculation.estimatedDays = method.estimatedDays;
        calculation.fee = totalFee;
        calculation.currency = "VND";

        return ResponseEntity.ok(ApiResponse.success(calculation));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<ShippingAddress>>> getAddresses(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(Collections.emptyList()));
        }

        List<ShippingAddress> addresses = userAddresses.getOrDefault(userId, Collections.emptyList());
        return ResponseEntity.ok(ApiResponse.success(addresses));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<ShippingAddress>> createAddress(
            @RequestBody ShippingAddress address,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        address.id = UUID.randomUUID().toString();
        address.userId = userId;
        if (address.isDefault == null) {
            address.isDefault = false;
        }

        // If this is set as default, unset others
        if (address.isDefault) {
            List<ShippingAddress> addresses = userAddresses.getOrDefault(userId, new ArrayList<>());
            addresses.forEach(a -> a.isDefault = false);
        }

        List<ShippingAddress> addresses = userAddresses.computeIfAbsent(userId, k -> new ArrayList<>());
        addresses.add(address);

        return ResponseEntity.ok(ApiResponse.success(address));
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<ShippingAddress>> updateAddress(
            @PathVariable String id,
            @RequestBody ShippingAddress updatedAddress,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        List<ShippingAddress> addresses = userAddresses.get(userId);
        if (addresses == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Address not found"));
        }

        ShippingAddress address = addresses.stream()
            .filter(a -> a.id.equals(id))
            .findFirst()
            .orElse(null);

        if (address == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Address not found"));
        }

        // Update fields
        if (updatedAddress.name != null) address.name = updatedAddress.name;
        if (updatedAddress.phone != null) address.phone = updatedAddress.phone;
        if (updatedAddress.address != null) address.address = updatedAddress.address;
        if (updatedAddress.province != null) address.province = updatedAddress.province;
        if (updatedAddress.district != null) address.district = updatedAddress.district;
        if (updatedAddress.ward != null) address.ward = updatedAddress.ward;
        if (updatedAddress.isDefault != null) {
            if (updatedAddress.isDefault) {
                addresses.forEach(a -> a.isDefault = false);
            }
            address.isDefault = updatedAddress.isDefault;
        }

        return ResponseEntity.ok(ApiResponse.success(address));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        List<ShippingAddress> addresses = userAddresses.get(userId);
        if (addresses == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Address not found"));
        }

        boolean removed = addresses.removeIf(a -> a.id.equals(id));
        if (!removed) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Address not found"));
        }

        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private static void seedShippingMethods() {
        ShippingMethod standard = new ShippingMethod();
        standard.id = "standard";
        standard.name = "Giao hàng tiêu chuẩn";
        standard.description = "Giao hàng trong 3-5 ngày";
        standard.baseFee = 30000.0;
        standard.estimatedDays = 5;
        standard.displayOrder = 1;
        standard.isActive = true;
        shippingMethods.put(standard.id, standard);

        ShippingMethod express = new ShippingMethod();
        express.id = "express";
        express.name = "Giao hàng nhanh";
        express.description = "Giao hàng trong 1-2 ngày";
        express.baseFee = 50000.0;
        express.estimatedDays = 2;
        express.displayOrder = 2;
        express.isActive = true;
        shippingMethods.put(express.id, express);

        ShippingMethod sameDay = new ShippingMethod();
        sameDay.id = "same-day";
        sameDay.name = "Giao hàng trong ngày";
        sameDay.description = "Giao hàng trong ngày (nội thành)";
        sameDay.baseFee = 80000.0;
        sameDay.estimatedDays = 1;
        sameDay.displayOrder = 3;
        sameDay.isActive = true;
        shippingMethods.put(sameDay.id, sameDay);
    }

    // Inner classes
    public static class ShippingMethod {
        public String id;
        public String name;
        public String description;
        public Double baseFee;
        public Integer estimatedDays;
        public Integer displayOrder;
        public Boolean isActive;
    }

    public static class ShippingCalculationRequest {
        public String methodId;
        public Double weight;
        public Double distance;
        public String addressId;
    }

    public static class ShippingCalculation {
        public String methodId;
        public String methodName;
        public Integer estimatedDays;
        public Double fee;
        public String currency;
    }

    public static class ShippingAddress {
        public String id;
        public String userId;
        public String name;
        public String phone;
        public String address;
        public String province;
        public String district;
        public String ward;
        public Boolean isDefault;
    }
}

