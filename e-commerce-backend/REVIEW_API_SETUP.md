# Hướng dẫn tích hợp API Review với Upload Ảnh/Video

## 1. Database Schema

Tạo các bảng sau trong database:

```sql
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    order_item_id VARCHAR(36),
    rating INT NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_item_id) REFERENCES order_items(id)
);

CREATE TABLE review_images (
    review_id VARCHAR(36),
    image_url VARCHAR(500),
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

CREATE TABLE review_videos (
    review_id VARCHAR(36),
    video_url VARCHAR(500),
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);
```

## 2. Files đã tạo

- `ReviewController.java` - Controller xử lý review với multipart/form-data
- `ReviewService.java` - Service xử lý logic review và upload file
- `ReviewDTO.java` - DTO cho review response
- `Review.java` - Entity cho review
- `ReviewRepository.java` - Repository cho review

## 3. API Endpoints

### GET `/api/reviews/product/{productId}`
Lấy danh sách review của sản phẩm

**Query Parameters:**
- `page` (default: 0)
- `size` (default: 20)

**Response:**
```json
{
  "content": [
    {
      "id": "...",
      "productId": "...",
      "userId": "...",
      "userName": "...",
      "userAvatar": "...",
      "rating": 5,
      "title": "...",
      "comment": "...",
      "images": ["url1", "url2"],
      "videos": ["url1"],
      "helpfulCount": 10,
      "createdAt": "2024-01-01T00:00:00"
    }
  ],
  "totalElements": 100,
  "totalPages": 5
}
```

### POST `/api/reviews/product/{productId}`
Tạo review với upload ảnh/video

**Headers:**
- `X-User-Id`: ID của user
- `Content-Type`: `multipart/form-data`

**Form Data:**
- `rating`: Integer (1-5)
- `title`: String
- `comment`: String
- `orderItemId`: String (optional)
- `images`: MultipartFile[] (optional, max 5)
- `videos`: MultipartFile[] (optional, max 2)

**Response:**
```json
{
  "id": "...",
  "productId": "...",
  "userId": "...",
  "userName": "...",
  "rating": 5,
  "title": "...",
  "comment": "...",
  "images": ["url1", "url2"],
  "videos": ["url1"],
  "helpfulCount": 0,
  "createdAt": "2024-01-01T00:00:00"
}
```

### POST `/api/reviews/product/{productId}/json`
Tạo review không có ảnh/video (JSON)

**Headers:**
- `X-User-Id`: ID của user
- `Content-Type`: `application/json`

**Body:**
```json
{
  "rating": 5,
  "title": "...",
  "comment": "...",
  "orderItemId": "..." // optional
}
```

### POST `/api/reviews/{reviewId}/helpful`
Đánh dấu review hữu ích

**Headers:**
- `X-User-Id`: ID của user

## 4. Dependencies cần thiết

Đảm bảo có `FileUploadService` để upload file lên MinIO hoặc storage khác.

## 5. Frontend Integration

Frontend đã được cập nhật:
- `components/review-form.tsx` - Form review với upload ảnh/video
- `lib/api/reviews.ts` - API client với method `createReviewWithMedia`

## 6. Lưu ý

- Giới hạn: 5 ảnh, 2 video mỗi review
- Kích thước file: Ảnh max 5MB, Video max 50MB
- File được upload lên MinIO/storage và lưu URL vào database


