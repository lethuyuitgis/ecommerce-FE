package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seller/products")
public class SellerProductController {

    // sellerId -> List of productIds
    private static final Map<String, List<String>> sellerProducts = new ConcurrentHashMap<>();

    @GetMapping
    public ResponseEntity<ApiResponse<ProductController.ProductPage>> getSellerProducts(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String status) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        // Mock sellerId - in production, get from user
        String sellerId = "seller-" + userId;
        List<String> productIds = sellerProducts.getOrDefault(sellerId, Collections.emptyList());
        
        List<ProductController.Product> products = productIds.stream()
            .map(ProductController.products::get)
            .filter(Objects::nonNull)
            .filter(p -> q == null || p.name.toLowerCase().contains(q.toLowerCase()))
            .filter(p -> categoryId == null || categoryId.equals(p.categoryId))
            .filter(p -> status == null || status.equalsIgnoreCase(p.status))
            .sorted((a, b) -> b.createdAt.compareTo(a.createdAt))
            .collect(Collectors.toList());

        int from = page * size;
        int to = Math.min(from + size, products.size());
        List<ProductController.Product> pageContent = from >= products.size() 
            ? Collections.emptyList() 
            : products.subList(from, to);

        ProductController.ProductPage result = new ProductController.ProductPage(
            pageContent,
            products.size(),
            (int) Math.ceil((double) products.size() / size),
            size,
            page
        );

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductController.Product>> getProductById(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        ProductController.Product product = ProductController.products.get(id);
        if (product == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Product not found"));
        }

        // Check ownership
        if (userId != null && !product.sellerId.equals("seller-" + userId)) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Access denied"));
        }

        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductController.Product>> createProduct(
            @RequestBody CreateProductRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(401)
                .body(ApiResponse.error("User not authenticated"));
        }

        ProductController.Product product = new ProductController.Product();
        product.id = UUID.randomUUID().toString();
        product.name = request.name;
        product.description = request.description;
        product.price = request.price;
        product.comparePrice = request.comparePrice;
        product.quantity = request.quantity != null ? request.quantity : 0;
        product.status = request.status != null ? request.status : "ACTIVE";
        product.categoryId = request.categoryId;
        product.categoryName = request.categoryName;
        product.sellerId = "seller-" + userId;
        product.sellerName = "Seller " + userId;
        product.images = request.images != null ? request.images : Collections.emptyList();
        product.primaryImage = request.images != null && !request.images.isEmpty() 
            ? request.images.get(0) : null;
        product.sku = request.sku;
        product.variants = request.variants;
        product.createdAt = Instant.now();
        product.rating = 0.0;
        product.totalReviews = 0;
        product.totalSold = 0;
        product.isFeatured = false;

        ProductController.products.put(product.id, product);
        sellerProducts.computeIfAbsent(product.sellerId, k -> new ArrayList<>()).add(product.id);

        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductController.Product>> updateProduct(
            @PathVariable String id,
            @RequestBody UpdateProductRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        ProductController.Product product = ProductController.products.get(id);
        if (product == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Product not found"));
        }

        if (userId != null && !product.sellerId.equals("seller-" + userId)) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Access denied"));
        }

        if (request.name != null) product.name = request.name;
        if (request.description != null) product.description = request.description;
        if (request.price != null) product.price = request.price;
        if (request.comparePrice != null) product.comparePrice = request.comparePrice;
        if (request.quantity != null) product.quantity = request.quantity;
        if (request.status != null) product.status = request.status;
        if (request.categoryId != null) product.categoryId = request.categoryId;
        if (request.categoryName != null) product.categoryName = request.categoryName;
        if (request.images != null) {
            product.images = request.images;
            product.primaryImage = !request.images.isEmpty() ? request.images.get(0) : null;
        }
        if (request.sku != null) product.sku = request.sku;
        if (request.variants != null) product.variants = request.variants;

        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        ProductController.Product product = ProductController.products.get(id);
        if (product == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Product not found"));
        }

        if (userId != null && !product.sellerId.equals("seller-" + userId)) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("Access denied"));
        }

        ProductController.products.remove(id);
        sellerProducts.getOrDefault(product.sellerId, Collections.emptyList()).remove(id);

        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Inner classes
    public static class CreateProductRequest {
        public String name;
        public String description;
        public Double price;
        public Double comparePrice;
        public Integer quantity;
        public String status;
        public String categoryId;
        public String categoryName;
        public String sku;
        public List<String> images;
        public List<String> videos;
        public Map<String, Object> variants;
    }

    public static class UpdateProductRequest {
        public String name;
        public String description;
        public Double price;
        public Double comparePrice;
        public Integer quantity;
        public String status;
        public String categoryId;
        public String categoryName;
        public String sku;
        public List<String> images;
        public Map<String, Object> variants;
    }
}

