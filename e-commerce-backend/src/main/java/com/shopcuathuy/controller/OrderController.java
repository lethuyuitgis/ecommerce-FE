package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Map<String, Order> orders = new ConcurrentHashMap<>();
    private static final Map<String, List<String>> userOrders = new ConcurrentHashMap<>(); // userId -> orderIds
    private static final Map<String, List<String>> sellerOrders = new ConcurrentHashMap<>(); // sellerId -> orderIds
    private static int orderNumberCounter = 1000;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getOrders(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(required = false) String status) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        List<String> orderIds = userOrders.getOrDefault(userId, Collections.emptyList());
        List<Order> userOrderList = orderIds.stream()
            .map(orders::get)
            .filter(Objects::nonNull)
            .filter(o -> status == null || o.status.equalsIgnoreCase(status))
            .sorted((a, b) -> b.createdAt.compareTo(a.createdAt))
            .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(userOrderList));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        Order order = orders.get(id);
        if (order == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Order not found"));
        }

        // Check authorization
        if (userId != null && !order.customerId.equals(userId)) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Access denied"));
        }

        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(
            @RequestBody CreateOrderRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        Order order = new Order();
        order.id = UUID.randomUUID().toString();
        order.orderNumber = "ORD" + (orderNumberCounter++);
        order.customerId = userId;
        order.customerName = "Customer " + userId;
        order.status = "PENDING";
        order.paymentStatus = "UNPAID";
        order.shippingStatus = "PENDING";
        order.paymentMethod = request.paymentMethod;
        order.notes = request.notes;
        order.createdAt = Instant.now();

        // Calculate totals
        double subtotal = 0.0;
        order.items = new ArrayList<>();
        for (CreateOrderItemRequest itemReq : request.items) {
            OrderItem item = new OrderItem();
            item.id = UUID.randomUUID().toString();
            item.productId = itemReq.productId;
            item.variantId = itemReq.variantId;
            item.quantity = itemReq.quantity;
            item.unitPrice = 100000.0; // Mock - should fetch from product
            item.productPrice = item.unitPrice;
            item.totalPrice = item.unitPrice * item.quantity;
            item.productName = "Product " + itemReq.productId;
            order.items.add(item);
            subtotal += item.totalPrice;
        }

        order.subtotal = subtotal;
        order.discountAmount = 0.0; // Apply voucher if needed
        order.shippingFee = 30000.0; // Mock shipping fee
        order.tax = subtotal * 0.1; // 10% tax
        order.finalTotal = subtotal - order.discountAmount + order.shippingFee + order.tax;

        // Get sellerId from first item (mock)
        order.sellerId = "seller-1";
        order.sellerName = "Seller Store";

        orders.put(order.id, order);
        userOrders.computeIfAbsent(userId, k -> new ArrayList<>()).add(order.id);
        sellerOrders.computeIfAbsent(order.sellerId, k -> new ArrayList<>()).add(order.id);

        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        Order order = orders.get(id);
        if (order == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Order not found"));
        }

        if (userId != null && !order.customerId.equals(userId)) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Access denied"));
        }

        if (!"PENDING".equals(order.status) && !"CONFIRMED".equals(order.status)) {
            return ResponseEntity.status(400)
                .body(ApiResponse.error("Order cannot be cancelled"));
        }

        order.status = "CANCELLED";
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String id,
            @RequestBody UpdateOrderStatusRequest request) {
        
        Order order = orders.get(id);
        if (order == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Order not found"));
        }

        order.status = request.status;
        if (request.paymentStatus != null) {
            order.paymentStatus = request.paymentStatus;
        }
        if (request.shippingStatus != null) {
            order.shippingStatus = request.shippingStatus;
        }

        return ResponseEntity.ok(ApiResponse.success(order));
    }

    // Inner classes
    public static class CreateOrderRequest {
        public List<CreateOrderItemRequest> items;
        public String shippingAddressId;
        public String paymentMethod;
        public String voucherCode;
        public String notes;
    }

    public static class CreateOrderItemRequest {
        public String productId;
        public String variantId;
        public Integer quantity;
    }

    public static class UpdateOrderStatusRequest {
        public String status;
        public String paymentStatus;
        public String shippingStatus;
    }

    public static class Order {
        public String id;
        public String orderNumber;
        public String customerId;
        public String customerName;
        public String sellerId;
        public String sellerName;
        public String status;
        public String paymentStatus;
        public String shippingStatus;
        public Double totalPrice;
        public Double subtotal;
        public Double discountAmount;
        public Double shippingFee;
        public Double tax;
        public Double finalTotal;
        public String paymentMethod;
        public String notes;
        public String customerNotes;
        public Instant createdAt;
        public List<OrderItem> items;
    }

    public static class OrderItem {
        public String id;
        public String productId;
        public String productName;
        public String variantId;
        public String variantName;
        public Integer quantity;
        public Double unitPrice;
        public Double productPrice;
        public Double variantPrice;
        public Double totalPrice;
        public String productImage;
    }
}

