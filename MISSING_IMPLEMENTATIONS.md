# Missing Implementations Report

## Tổng quan

Báo cáo các logic và API endpoint chưa được implement trong backend.

## 1. Authentication & User Management

### ❌ Chưa có Controller
- **`/api/auth/login`** - POST - Đăng nhập
- **`/api/auth/register`** - POST - Đăng ký
- **`/api/auth/logout`** - POST - Đăng xuất
- **`/api/auth/refresh`** - POST - Refresh token
- **`/api/users/profile`** - GET/PUT - Quản lý profile user

**Frontend calls:** `lib/api/auth.ts`, `lib/api/user.ts`

## 2. Products Management

### ❌ Chưa có Controller
- **`/api/products`** - GET - Lấy danh sách sản phẩm
- **`/api/products/{id}`** - GET - Chi tiết sản phẩm
- **`/api/products/featured`** - GET - Sản phẩm nổi bật
- **`/api/products/category/{slug}`** - GET - Sản phẩm theo category
- **`/api/products/search`** - GET - Tìm kiếm sản phẩm
- **`/api/seller/products`** - GET/POST - Quản lý sản phẩm của seller
- **`/api/seller/products/{id}`** - GET/PUT/DELETE - CRUD sản phẩm
- **`/api/seller/products/crawl`** - POST - Crawl sản phẩm từ URL
- **`/api/seller/products/crawl/batch`** - POST - Crawl nhiều sản phẩm
- **`/api/seller/products/crawl/category`** - POST - Crawl theo category
- **`/api/seller/products/import`** - POST - Import từ Excel

**Frontend calls:** `lib/api/products.ts`, `lib/api/seller.ts`

## 3. Cart Management

### ❌ Chưa có Controller
- **`/api/cart`** - GET - Lấy giỏ hàng
- **`/api/cart/add`** - POST - Thêm vào giỏ hàng
- **`/api/cart/{id}`** - PUT/DELETE - Cập nhật/xóa item trong giỏ

**Frontend calls:** `lib/api/cart.ts`

## 4. Orders Management

### ❌ Chưa có Controller
- **`/api/orders`** - GET - Lấy danh sách đơn hàng
- **`/api/orders/{id}`** - GET - Chi tiết đơn hàng
- **`/api/orders`** - POST - Tạo đơn hàng mới
- **`/api/orders/{id}/cancel`** - POST - Hủy đơn hàng
- **`/api/orders/{id}/status`** - PUT - Cập nhật trạng thái
- **`/api/seller/orders`** - GET - Đơn hàng của seller
- **`/api/seller/orders/{id}`** - GET - Chi tiết đơn hàng seller

**Frontend calls:** `lib/api/orders.ts`

## 5. Checkout

### ❌ Chưa có Controller
- **`/api/checkout`** - POST - Thanh toán đơn hàng
- **`/api/checkout/validate`** - POST - Validate thông tin checkout

**Frontend calls:** `lib/api/checkout.ts`

## 6. Categories

### ❌ Chưa có Controller
- **`/api/categories`** - GET - Lấy danh sách categories
- **`/api/categories/{id}`** - GET - Chi tiết category
- **`/api/categories/{slug}`** - GET - Category theo slug

**Frontend calls:** `lib/api/categories.ts`

## 7. Shipping

### ❌ Chưa có Controller
- **`/api/shipping/methods`** - GET - Lấy danh sách phương thức vận chuyển
- **`/api/shipping/calculate`** - POST - Tính phí vận chuyển
- **`/api/shipping/addresses`** - GET/POST - Quản lý địa chỉ giao hàng

**Frontend calls:** `lib/api/shipping.ts`

## 8. Payment

### ❌ Chưa có Controller
- **`/api/payment/methods`** - GET - Phương thức thanh toán
- **`/api/payment/process`** - POST - Xử lý thanh toán
- **`/api/payment/callback`** - POST - Callback từ payment gateway

**Frontend calls:** `lib/api/payment.ts`

## 9. Reviews

### ✅ Đã có Controller
- **`/api/reviews/product/{productId}`** - GET - ✅ Implemented
- **`/api/reviews`** - POST - ✅ Implemented
- **`/api/reviews/{reviewId}/helpful`** - POST - ✅ Implemented

## 10. Seller Features

### ❌ Chưa có Controller
- **`/api/seller/profile`** - GET/PUT - Profile seller
- **`/api/seller/create`** - POST - Tạo seller account
- **`/api/seller/business-hours`** - GET/PUT - Giờ làm việc
- **`/api/seller/products`** - GET/POST - Quản lý sản phẩm (đã liệt kê ở trên)

**Frontend calls:** `lib/api/seller.ts`

### ✅ Đã có Controller
- **`/api/seller/overview`** - GET - ✅ Implemented
- **`/api/seller/analytics/dashboard`** - GET - ✅ Implemented
- **`/api/seller/promotions`** - GET/POST - ✅ Implemented
- **`/api/seller/reports`** - POST - ✅ Implemented

## 11. Admin Features

### ✅ Đã có Controller
- **`/api/admin/users`** - GET/POST - ✅ Implemented
- **`/api/admin/sellers`** - GET - ✅ Implemented
- **`/api/admin/vouchers`** - GET/POST/DELETE - ✅ Implemented
- **`/api/admin/shipments`** - GET/POST - ✅ Implemented
- **`/api/admin/complaints`** - GET/POST - ✅ Implemented
- **`/api/admin/system/metrics`** - GET - ✅ Implemented

## 12. Notifications

### ✅ Đã có Controller
- **`/api/notifications`** - GET - ✅ Implemented
- **`/api/notifications/unread-count`** - GET - ✅ Implemented
- **`/api/notifications/{id}/read`** - POST - ✅ Implemented
- **`/api/notifications/read-all`** - POST - ✅ Implemented
- **`/api/notifications/{id}`** - DELETE - ✅ Implemented

## 13. Upload/File Management

### ❌ Chưa có Controller
- **`/api/upload/image`** - POST - Upload ảnh
- **`/api/upload/video`** - POST - Upload video
- **`/api/upload/excel`** - POST - Upload Excel

**Frontend calls:** `lib/api/upload.ts`

**Note:** Có route trong Next.js nhưng backend chưa có controller tương ứng.

## 14. Wishlist

### ❌ Chưa có Controller
- **`/api/wishlist`** - GET - Lấy wishlist
- **`/api/wishlist`** - POST - Thêm vào wishlist
- **`/api/wishlist/{id}`** - DELETE - Xóa khỏi wishlist

**Frontend calls:** `lib/api/wishlist.ts`

## 15. Analytics & Reports

### ✅ Đã có Controller
- **`/api/seller/analytics/dashboard`** - GET - ✅ Implemented
- **`/api/seller/reports`** - POST - ✅ Implemented

### ❌ Chưa có Controller
- **`/api/analytics`** - GET - Analytics tổng quan (nếu cần)

## 16. Messages/Chat

### ❌ Chưa có Controller
- **`/api/messages`** - GET/POST - Chat messages
- **`/api/messages/conversations`** - GET - Danh sách cuộc trò chuyện

**Frontend calls:** `lib/api/messages.ts`

## 17. Inventory Management

### ❌ Chưa có Controller
- **`/api/inventory`** - GET - Quản lý tồn kho
- **`/api/inventory/update`** - PUT - Cập nhật tồn kho

**Frontend calls:** `lib/api/inventory.ts`

## Tóm tắt

### ✅ Đã implement (17 endpoints)
- Admin management (users, sellers, vouchers, shipments, complaints)
- Seller analytics & overview
- Seller promotions
- Notifications
- Reviews
- Reports

### ❌ Chưa implement (50+ endpoints)
- **Authentication & User** (5 endpoints)
- **Products** (10+ endpoints)
- **Cart** (3 endpoints)
- **Orders** (8+ endpoints)
- **Checkout** (2 endpoints)
- **Categories** (3 endpoints)
- **Shipping** (3+ endpoints)
- **Payment** (3 endpoints)
- **Seller Profile** (3 endpoints)
- **Upload** (3 endpoints)
- **Wishlist** (3 endpoints)
- **Messages** (2+ endpoints)
- **Inventory** (2 endpoints)

## Ưu tiên implement

### High Priority (Core Features)
1. **Authentication** - Cần thiết cho mọi tính năng
2. **Products** - Core feature của e-commerce
3. **Cart** - Cần thiết cho checkout
4. **Orders** - Core business logic
5. **Checkout** - Hoàn thiện flow mua hàng

### Medium Priority
6. **Categories** - Navigation và filtering
7. **Shipping** - Tính phí vận chuyển
8. **Seller Profile** - Quản lý shop

### Low Priority
9. **Wishlist** - Nice to have
10. **Messages** - Chat feature
11. **Inventory** - Advanced inventory management

## Ghi chú

- Backend hiện tại sử dụng **In-Memory Data Store** (`AdminDataStore`)
- Cần migrate sang **Database** (JPA) để lưu trữ dữ liệu persistent
- Các endpoint đã có chỉ là mock data, chưa có business logic thật
- Cần implement authentication/authorization cho các protected endpoints

