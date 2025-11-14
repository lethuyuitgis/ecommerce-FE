package com.shopcuathuy.controller;

import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private static final Map<String, Category> categories = new ConcurrentHashMap<>();
    private static final Map<String, String> slugToId = new ConcurrentHashMap<>();

    static {
        seedCategories();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> allCategories = new ArrayList<>(categories.values());
        allCategories.sort((a, b) -> {
            int orderCompare = Integer.compare(
                a.displayOrder != null ? a.displayOrder : 0,
                b.displayOrder != null ? b.displayOrder : 0
            );
            if (orderCompare != 0) return orderCompare;
            return a.name.compareTo(b.name);
        });
        return ResponseEntity.ok(ApiResponse.success(allCategories));
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<ApiResponse<Category>> getCategory(@PathVariable String idOrSlug) {
        Category category = categories.get(idOrSlug);
        if (category == null) {
            String id = slugToId.get(idOrSlug);
            if (id != null) {
                category = categories.get(id);
            }
        }
        
        if (category == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Category not found"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Category category) {
        category.id = UUID.randomUUID().toString();
        if (category.slug == null || category.slug.isEmpty()) {
            category.slug = category.name.toLowerCase().replaceAll("\\s+", "-");
        }
        category.isActive = category.isActive != null ? category.isActive : true;
        categories.put(category.id, category);
        slugToId.put(category.slug, category.id);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable String id,
            @RequestBody Category category) {
        
        Category existing = categories.get(id);
        if (existing == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Category not found"));
        }

        if (category.name != null) existing.name = category.name;
        if (category.description != null) existing.description = category.description;
        if (category.slug != null) {
            slugToId.remove(existing.slug);
            existing.slug = category.slug;
            slugToId.put(category.slug, id);
        }
        if (category.icon != null) existing.icon = category.icon;
        if (category.coverImage != null) existing.coverImage = category.coverImage;
        if (category.parentId != null) existing.parentId = category.parentId;
        if (category.displayOrder != null) existing.displayOrder = category.displayOrder;
        if (category.isActive != null) existing.isActive = category.isActive;

        return ResponseEntity.ok(ApiResponse.success(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String id) {
        Category category = categories.remove(id);
        if (category == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Category not found"));
        }
        slugToId.remove(category.slug);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Category>> toggleActive(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> request) {
        
        Category category = categories.get(id);
        if (category == null) {
            return ResponseEntity.status(404)
                .body(ApiResponse.error("Category not found"));
        }

        Boolean active = request.get("active");
        if (active != null) {
            category.isActive = active;
        } else {
            category.isActive = !category.isActive;
        }

        return ResponseEntity.ok(ApiResponse.success(category));
    }

    private static void seedCategories() {
        Category cat1 = new Category();
        cat1.id = "electronics";
        cat1.name = "Điện tử";
        cat1.slug = "dien-tu";
        cat1.description = "Thiết bị điện tử";
        cat1.icon = "📱";
        cat1.displayOrder = 1;
        cat1.isActive = true;
        categories.put(cat1.id, cat1);
        slugToId.put(cat1.slug, cat1.id);

        Category cat2 = new Category();
        cat2.id = "fashion";
        cat2.name = "Thời trang";
        cat2.slug = "thoi-trang";
        cat2.description = "Quần áo, phụ kiện thời trang";
        cat2.icon = "👕";
        cat2.displayOrder = 2;
        cat2.isActive = true;
        categories.put(cat2.id, cat2);
        slugToId.put(cat2.slug, cat2.id);

        Category cat3 = new Category();
        cat3.id = "beauty";
        cat3.name = "Làm đẹp";
        cat3.slug = "lam-dep";
        cat3.description = "Mỹ phẩm, làm đẹp";
        cat3.icon = "💄";
        cat3.displayOrder = 3;
        cat3.isActive = true;
        categories.put(cat3.id, cat3);
        slugToId.put(cat3.slug, cat3.id);

        Category cat4 = new Category();
        cat4.id = "home";
        cat4.name = "Nhà cửa";
        cat4.slug = "nha-cua";
        cat4.description = "Đồ dùng gia đình";
        cat4.icon = "🏠";
        cat4.displayOrder = 4;
        cat4.isActive = true;
        categories.put(cat4.id, cat4);
        slugToId.put(cat4.slug, cat4.id);
    }

    // Inner class
    public static class Category {
        public String id;
        public String name;
        public String slug;
        public String description;
        public String icon;
        public String coverImage;
        public String parentId;
        public Integer displayOrder;
        public Boolean isActive;
        public List<Category> children;
        public List<String> subcategories;
    }
}

