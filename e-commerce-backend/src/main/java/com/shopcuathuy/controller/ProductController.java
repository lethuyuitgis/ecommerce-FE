package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    public static final Map<String, Product> products = new ConcurrentHashMap<>();
    private static final Map<String, List<String>> categoryProducts = new ConcurrentHashMap<>();

    static {
        // Seed sample products
        seedProducts();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProductPage>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        
        List<Product> allProducts = new ArrayList<>(products.values());
        
        // Sort
        Comparator<Product> comparator = getComparator(sortBy);
        if ("ASC".equalsIgnoreCase(direction)) {
            allProducts.sort(comparator);
        } else {
            allProducts.sort(comparator.reversed());
        }
        
        // Paginate
        int from = page * size;
        int to = Math.min(from + size, allProducts.size());
        List<Product> pageContent = from >= allProducts.size() 
            ? Collections.emptyList() 
            : allProducts.subList(from, to);
        
        ProductPage result = new ProductPage(
            pageContent,
            allProducts.size(),
            (int) Math.ceil((double) allProducts.size() / size),
            size,
            page
        );
        
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<ProductPage>> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<Product> featured = products.values().stream()
            .filter(p -> p.isFeatured)
            .sorted((a, b) -> b.createdAt.compareTo(a.createdAt))
            .collect(Collectors.toList());
        
        int from = page * size;
        int to = Math.min(from + size, featured.size());
        List<Product> pageContent = from >= featured.size() 
            ? Collections.emptyList() 
            : featured.subList(from, to);
        
        ProductPage result = new ProductPage(
            pageContent,
            featured.size(),
            (int) Math.ceil((double) featured.size() / size),
            size,
            page
        );
        
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable String id) {
        Product product = products.get(id);
        if (product == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Product not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/category/{slug}")
    public ResponseEntity<ApiResponse<ProductPage>> getProductsByCategory(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<String> productIds = categoryProducts.getOrDefault(slug, Collections.emptyList());
        List<Product> categoryProductsList = productIds.stream()
            .map(products::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
        
        int from = page * size;
        int to = Math.min(from + size, categoryProductsList.size());
        List<Product> pageContent = from >= categoryProductsList.size() 
            ? Collections.emptyList() 
            : categoryProductsList.subList(from, to);
        
        ProductPage result = new ProductPage(
            pageContent,
            categoryProductsList.size(),
            (int) Math.ceil((double) categoryProductsList.size() / size),
            size,
            page
        );
        
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<ProductPage>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        String lowerKeyword = keyword.toLowerCase();
        List<Product> results = products.values().stream()
            .filter(p -> p.name.toLowerCase().contains(lowerKeyword) ||
                        (p.description != null && p.description.toLowerCase().contains(lowerKeyword)))
            .collect(Collectors.toList());
        
        int from = page * size;
        int to = Math.min(from + size, results.size());
        List<Product> pageContent = from >= results.size() 
            ? Collections.emptyList() 
            : results.subList(from, to);
        
        ProductPage result = new ProductPage(
            pageContent,
            results.size(),
            (int) Math.ceil((double) results.size() / size),
            size,
            page
        );
        
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    private Comparator<Product> getComparator(String sortBy) {
        switch (sortBy.toLowerCase()) {
            case "price":
                return Comparator.comparing(p -> p.price);
            case "name":
                return Comparator.comparing(p -> p.name);
            case "rating":
                return Comparator.comparing(p -> p.rating != null ? p.rating : 0.0);
            default:
                return Comparator.comparing(p -> p.createdAt);
        }
    }

    private static void seedProducts() {
        Instant now = Instant.now();
        
        Product p1 = new Product();
        p1.id = UUID.randomUUID().toString();
        p1.name = "iPhone 15 Pro Max 256GB";
        p1.description = "Latest iPhone with advanced features";
        p1.price = 29990000.0;
        p1.comparePrice = 32990000.0;
        p1.quantity = 50;
        p1.status = "ACTIVE";
        p1.rating = 4.8;
        p1.totalReviews = 128;
        p1.totalSold = 456;
        p1.isFeatured = true;
        p1.categoryId = "electronics";
        p1.categoryName = "Điện tử";
        p1.sellerId = "seller-1";
        p1.sellerName = "Tech Store";
        p1.images = Arrays.asList("/modern-smartphone.png");
        p1.primaryImage = "/modern-smartphone.png";
        p1.createdAt = now;
        products.put(p1.id, p1);
        categoryProducts.computeIfAbsent("electronics", k -> new ArrayList<>()).add(p1.id);
        
        Product p2 = new Product();
        p2.id = UUID.randomUUID().toString();
        p2.name = "Áo Thun Nam Basic";
        p2.description = "Áo thun nam chất lượng cao";
        p2.price = 199000.0;
        p2.comparePrice = 299000.0;
        p2.quantity = 200;
        p2.status = "ACTIVE";
        p2.rating = 4.5;
        p2.totalReviews = 89;
        p2.totalSold = 234;
        p2.isFeatured = true;
        p2.categoryId = "fashion";
        p2.categoryName = "Thời trang";
        p2.sellerId = "seller-1";
        p2.sellerName = "Fashion Store";
        p2.images = Arrays.asList("/plain-white-tshirt.png");
        p2.primaryImage = "/plain-white-tshirt.png";
        p2.createdAt = now;
        products.put(p2.id, p2);
        categoryProducts.computeIfAbsent("fashion", k -> new ArrayList<>()).add(p2.id);
    }

    // Inner classes
    public static class Product {
        public String id;
        public String name;
        public String description;
        public String sku;
        public Double price;
        public Double comparePrice;
        public Integer quantity;
        public String status;
        public Double rating;
        public Integer totalReviews;
        public Integer totalSold;
        public Integer totalViews;
        public Boolean isFeatured;
        public String categoryId;
        public String categoryName;
        public String sellerId;
        public String sellerName;
        public List<String> images;
        public String primaryImage;
        public Map<String, Object> variants;
        public Instant createdAt;
    }

    public static class ProductPage {
        public List<Product> content;
        public Integer totalElements;
        public Integer totalPages;
        public Integer size;
        public Integer number;

        public ProductPage(List<Product> content, Integer totalElements, 
                          Integer totalPages, Integer size, Integer number) {
            this.content = content;
            this.totalElements = totalElements;
            this.totalPages = totalPages;
            this.size = size;
            this.number = number;
        }
    }
}

