package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private static final Map<String, PaymentMethod> paymentMethods = new ConcurrentHashMap<>();
    private static final Map<String, Payment> payments = new ConcurrentHashMap<>();

    static {
        seedPaymentMethods();
    }

    @GetMapping("/methods")
    public ResponseEntity<ApiResponse<List<PaymentMethod>>> getPaymentMethods() {
        List<PaymentMethod> methods = new ArrayList<>(paymentMethods.values());
        methods.sort(Comparator.comparing(m -> m.displayOrder != null ? m.displayOrder : 0));
        return ResponseEntity.ok(ApiResponse.success(methods));
    }

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
            @RequestBody PaymentRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        PaymentMethod method = paymentMethods.get(request.methodId);
        if (method == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Payment method not found"));
        }

        // Create payment record
        Payment payment = new Payment();
        payment.id = UUID.randomUUID().toString();
        payment.orderId = request.orderId;
        payment.userId = userId;
        payment.methodId = request.methodId;
        payment.methodName = method.name;
        payment.amount = request.amount;
        payment.status = "PENDING";
        payment.createdAt = java.time.Instant.now();

        payments.put(payment.id, payment);

        // Mock payment processing
        PaymentResponse response = new PaymentResponse();
        response.paymentId = payment.id;
        response.status = "SUCCESS"; // In production, this would be async
        response.transactionId = "TXN" + System.currentTimeMillis();
        response.paymentUrl = method.requiresRedirect ? "/payment/redirect/" + payment.id : null;
        response.message = "Payment processed successfully";

        // Update payment status
        payment.status = "SUCCESS";
        payment.completedAt = java.time.Instant.now();

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<Payment>> getPayment(
            @PathVariable String paymentId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        Payment payment = payments.get(paymentId);
        if (payment == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Payment not found"));
        }

        if (userId != null && !payment.userId.equals(userId)) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Access denied"));
        }

        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @PostMapping("/callback")
    public ResponseEntity<ApiResponse<PaymentCallbackResponse>> paymentCallback(
            @RequestBody PaymentCallbackRequest request) {
        
        // Handle payment gateway callback
        Payment payment = payments.get(request.paymentId);
        if (payment == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Payment not found"));
        }

        // Update payment status based on callback
        payment.status = request.status;
        if ("SUCCESS".equals(request.status)) {
            payment.completedAt = java.time.Instant.now();
        }

        PaymentCallbackResponse response = new PaymentCallbackResponse();
        response.paymentId = payment.id;
        response.status = payment.status;
        response.message = "Payment status updated";

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    private static void seedPaymentMethods() {
        PaymentMethod cod = new PaymentMethod();
        cod.id = "cod";
        cod.name = "Thanh toán khi nhận hàng (COD)";
        cod.description = "Thanh toán bằng tiền mặt khi nhận hàng";
        cod.icon = "💰";
        cod.displayOrder = 1;
        cod.isActive = true;
        cod.requiresRedirect = false;
        paymentMethods.put(cod.id, cod);

        PaymentMethod bank = new PaymentMethod();
        bank.id = "bank-transfer";
        bank.name = "Chuyển khoản ngân hàng";
        bank.description = "Chuyển khoản qua ngân hàng";
        bank.icon = "🏦";
        bank.displayOrder = 2;
        bank.isActive = true;
        bank.requiresRedirect = false;
        paymentMethods.put(bank.id, bank);

        PaymentMethod vnpay = new PaymentMethod();
        vnpay.id = "vnpay";
        vnpay.name = "VNPay";
        vnpay.description = "Thanh toán qua VNPay";
        vnpay.icon = "💳";
        vnpay.displayOrder = 3;
        vnpay.isActive = true;
        vnpay.requiresRedirect = true;
        paymentMethods.put(vnpay.id, vnpay);

        PaymentMethod momo = new PaymentMethod();
        momo.id = "momo";
        momo.name = "MoMo";
        momo.description = "Thanh toán qua ví MoMo";
        momo.icon = "📱";
        momo.displayOrder = 4;
        momo.isActive = true;
        momo.requiresRedirect = true;
        paymentMethods.put(momo.id, momo);
    }

    // Inner classes
    public static class PaymentMethod {
        public String id;
        public String name;
        public String description;
        public String icon;
        public Integer displayOrder;
        public Boolean isActive;
        public Boolean requiresRedirect;
    }

    public static class PaymentRequest {
        public String orderId;
        public String methodId;
        public Double amount;
    }

    public static class PaymentResponse {
        public String paymentId;
        public String status;
        public String transactionId;
        public String paymentUrl;
        public String message;
    }

    public static class Payment {
        public String id;
        public String orderId;
        public String userId;
        public String methodId;
        public String methodName;
        public Double amount;
        public String status;
        public java.time.Instant createdAt;
        public java.time.Instant completedAt;
    }

    public static class PaymentCallbackRequest {
        public String paymentId;
        public String status;
        public String transactionId;
    }

    public static class PaymentCallbackResponse {
        public String paymentId;
        public String status;
        public String message;
    }
}

