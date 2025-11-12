# Hướng dẫn sửa backend để trả về ảnh sản phẩm

## Vấn đề
Backend không trả về field `primaryImage` hoặc `images` trong ProductDTO khi gọi `/api/seller/products`.

## Giải pháp

### 1. Sửa ProductDTO để thêm field ảnh

Trong file `ProductDTO.java` (hoặc file DTO tương ứng), thêm các field sau:

```java
import java.util.List;

public class ProductDTO {
    // ... các field hiện có ...
    
    // Thêm các field ảnh
    private String primaryImage;
    private List<String> images;
    
    // Getters và Setters
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
}
```

### 2. Sửa SellerService.getSellerProducts()

Trong file `SellerService.java`, tìm method `getSellerProducts()` và sửa để join với bảng `product_images`:

```java
public Page<ProductDTO> getSellerProducts(String userId, Pageable pageable) {
    // Lấy seller
    Seller seller = sellerRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("Seller not found"));
    
    // Query products với join product_images
    Page<Product> products = productRepository.findBySellerId(seller.getId(), pageable);
    
    // Map sang DTO và load images
    return products.map(product -> {
        ProductDTO dto = mapToDTO(product);
        
        // Load images từ product_images table
        List<ProductImage> productImages = productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
        
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
```

### 3. Hoặc sửa trong method mapToDTO()

Nếu bạn có method `mapToDTO()`, sửa như sau:

```java
private ProductDTO mapToDTO(Product product) {
    ProductDTO dto = new ProductDTO();
    // ... map các field khác ...
    
    // Load images
    List<ProductImage> productImages = productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
    
    if (!productImages.isEmpty()) {
        // Lấy ảnh primary
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
}
```

### 4. Đảm bảo có ProductImageRepository

Nếu chưa có, tạo interface:

```java
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {
    List<ProductImage> findByProductIdOrderByDisplayOrderAsc(UUID productId);
}
```

### 5. Nếu dùng @Query với JOIN

Hoặc bạn có thể dùng @Query để join trực tiếp:

```java
@Query("SELECT p FROM Product p " +
       "LEFT JOIN FETCH p.productImages pi " +
       "WHERE p.seller.id = :sellerId " +
       "ORDER BY pi.displayOrder ASC")
Page<Product> findBySellerIdWithImages(@Param("sellerId") UUID sellerId, Pageable pageable);
```

Sau đó trong service:

```java
Page<Product> products = productRepository.findBySellerIdWithImages(seller.getId(), pageable);

return products.map(product -> {
    ProductDTO dto = mapToDTO(product);
    
    // Product đã có images loaded
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
```

## Kiểm tra

Sau khi sửa, test API:

```bash
curl 'http://localhost:8080/api/seller/products?page=0&size=10' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'X-User-Id: YOUR_USER_ID'
```

Response phải có dạng:

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "...",
        "name": "Product Name",
        "primaryImage": "http://localhost:9000/products/image1.jpg",
        "images": [
          "http://localhost:9000/products/image1.jpg",
          "http://localhost:9000/products/image2.jpg"
        ],
        ...
      }
    ]
  }
}
```

## Lưu ý

- Đảm bảo URL ảnh là absolute URL (có domain) hoặc relative path hợp lệ
- Nếu dùng MinIO, URL có thể là: `http://localhost:9000/bucket-name/path/to/image.jpg`
- Frontend đã có logic transform để xử lý nhiều format khác nhau, nhưng tốt nhất là trả về đúng format `primaryImage` và `images[]`


