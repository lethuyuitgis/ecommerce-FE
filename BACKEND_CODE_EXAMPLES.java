// ============================================
// BACKEND CODE EXAMPLES - Copy vào project backend
// ============================================

// 1. ProductDTO.java - Thêm field ảnh
// ============================================
package com.shopcuathuy.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

public class ProductDTO {
    private UUID id;
    private String name;
    private String description;
    private String sku;
    private BigDecimal price;
    private BigDecimal comparePrice;
    private Integer quantity;
    private Integer minOrder;
    private String status;
    private BigDecimal rating;
    private Integer totalReviews;
    private Integer totalSold;
    private Integer totalViews;
    private Boolean isFeatured;
    private UUID categoryId;
    private String categoryName;
    private UUID sellerId;
    private String sellerName;
    
    // THÊM CÁC FIELD NÀY:
    private String primaryImage;
    private List<String> images;
    
    // Getters và Setters cho images
    public String getPrimaryImage() {
        return primaryImage;
    }
    
    public void setPrimaryImage(String primaryImage) {
        this.primaryImage = primaryImage;
    }
    
    public List<String> getImages() {
        return images;
    }
    
    public void setImages(List<String> images) {
        this.images = images;
    }
    
    // ... các getter/setter khác ...
}

// ============================================
// 2. SellerService.java - Sửa getSellerProducts()
// ============================================
package com.shopcuathuy.service;

import com.shopcuathuy.dto.ProductDTO;
import com.shopcuathuy.entity.Product;
import com.shopcuathuy.entity.ProductImage;
import com.shopcuathuy.entity.Seller;
import com.shopcuathuy.repository.ProductRepository;
import com.shopcuathuy.repository.ProductImageRepository;
import com.shopcuathuy.repository.SellerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerService {
    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    
    public Page<ProductDTO> getSellerProducts(String userId, Pageable pageable) {
        // Lấy seller
        Seller seller = sellerRepository.findByUserId(UUID.fromString(userId))
            .orElseThrow(() -> new RuntimeException("Seller not found"));
        
        // Query products
        Page<Product> products = productRepository.findBySellerId(seller.getId(), pageable);
        
        // Map sang DTO và load images
        return products.map(product -> {
            ProductDTO dto = mapToDTO(product);
            
            // Load images từ product_images table
            List<ProductImage> productImages = productImageRepository
                .findByProductIdOrderByDisplayOrderAsc(product.getId());
            
            if (!productImages.isEmpty()) {
                // Lấy ảnh primary (isPrimary = true) hoặc ảnh đầu tiên
                ProductImage primaryImg = productImages.stream()
                    .filter(ProductImage::isPrimary)
                    .findFirst()
                    .orElse(productImages.get(0));
                
                dto.setPrimaryImage(primaryImg.getImageUrl());
                
                // Set tất cả ảnh
                List<String> imageUrls = productImages.stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
                dto.setImages(imageUrls);
            }
            
            return dto;
        });
    }
    
    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setSku(product.getSku());
        dto.setPrice(product.getPrice());
        dto.setComparePrice(product.getComparePrice());
        dto.setQuantity(product.getQuantity());
        dto.setMinOrder(product.getMinOrder());
        dto.setStatus(product.getStatus().name());
        dto.setRating(product.getRating());
        dto.setTotalReviews(product.getTotalReviews());
        dto.setTotalSold(product.getTotalSold());
        dto.setTotalViews(product.getTotalViews());
        dto.setIsFeatured(product.getIsFeatured());
        
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        
        if (product.getSeller() != null) {
            dto.setSellerId(product.getSeller().getId());
            dto.setSellerName(product.getSeller().getShopName());
        }
        
        return dto;
    }
}

// ============================================
// 3. ProductImageRepository.java
// ============================================
package com.shopcuathuy.repository;

import com.shopcuathuy.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {
    List<ProductImage> findByProductIdOrderByDisplayOrderAsc(UUID productId);
}

// ============================================
// 4. Nếu dùng @Query với JOIN (tối ưu hơn)
// ============================================
// Trong ProductRepository.java:

package com.shopcuathuy.repository;

import com.shopcuathuy.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    // Query với JOIN để load images luôn
    @Query("SELECT DISTINCT p FROM Product p " +
           "LEFT JOIN FETCH p.productImages pi " +
           "WHERE p.seller.id = :sellerId")
    Page<Product> findBySellerIdWithImages(@Param("sellerId") UUID sellerId, Pageable pageable);
    
    // Hoặc query thông thường
    Page<Product> findBySellerId(UUID sellerId, Pageable pageable);
}

// Sau đó trong SellerService, dùng:
public Page<ProductDTO> getSellerProducts(String userId, Pageable pageable) {
    Seller seller = sellerRepository.findByUserId(UUID.fromString(userId))
        .orElseThrow(() -> new RuntimeException("Seller not found"));
    
    // Dùng query có JOIN
    Page<Product> products = productRepository.findBySellerIdWithImages(seller.getId(), pageable);
    
    return products.map(product -> {
        ProductDTO dto = mapToDTO(product);
        
        // Product đã có images loaded (không cần query thêm)
        if (product.getProductImages() != null && !product.getProductImages().isEmpty()) {
            ProductImage primaryImg = product.getProductImages().stream()
                .filter(ProductImage::isPrimary)
                .findFirst()
                .orElse(product.getProductImages().get(0));
            
            dto.setPrimaryImage(primaryImg.getImageUrl());
            
            List<String> imageUrls = product.getProductImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
            dto.setImages(imageUrls);
        }
        
        return dto;
    });
}

// ============================================
// 5. Nếu entity Product có relationship với ProductImage
// ============================================
// Trong Product.java entity:

package com.shopcuathuy.entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    // ... các field khác ...
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> productImages;
    
    // Getter và Setter
    public List<ProductImage> getProductImages() {
        return productImages;
    }
    
    public void setProductImages(List<ProductImage> productImages) {
        this.productImages = productImages;
    }
}

// ============================================
// 6. ProductImage.java entity (nếu chưa có)
// ============================================
package com.shopcuathuy.entity;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "alt_text")
    private String altText;
    
    @Column(name = "display_order")
    private Integer displayOrder;
    
    @Column(name = "is_primary")
    private Boolean isPrimary;
    
    // Getters và Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }
    
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    
    public Boolean isPrimary() { return isPrimary != null && isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }
}


