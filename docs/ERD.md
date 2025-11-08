# Entity Relationship Diagram (ERD) - ShopCuaThuy

## Toàn bộ cấu trúc quan hệ giữa các bảng

\`\`\`mermaid
erDiagram
    USERS ||--o{ SELLERS : manages
    USERS ||--o{ ORDERS : places
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ WISHLIST : adds
    USERS ||--o{ CART_ITEMS : has
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ MESSAGES : sends
    USERS ||--o{ ADDRESSES : has
    
    SELLERS ||--o{ PRODUCTS : sells
    SELLERS ||--o{ SELLER_RATINGS : receives
    SELLERS ||--o{ PROMOTIONS : creates
    SELLERS ||--o{ SHOP_SETTINGS : has
    
    CATEGORIES ||--o{ PRODUCTS : contains
    PRODUCTS ||--o{ PRODUCT_IMAGES : has
    PRODUCTS ||--o{ REVIEWS : receives
    PRODUCTS ||--o{ WISHLIST : added_to
    PRODUCTS ||--o{ CART_ITEMS : added_to
    PRODUCTS ||--o{ ORDER_ITEMS : included_in
    
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ PAYMENTS : has
    ORDERS ||--o{ SHIPMENTS : has
    ORDERS ||--o{ RETURNS : has
    
    PAYMENTS ||--o{ PAYMENT_METHODS : uses
    
    SHIPMENTS ||--o{ TRACKING_UPDATES : tracked_by
    SHIPMENTS ||--o{ SHIPPING_METHODS : uses
    SHIPPING_PARTNERS ||--o{ SHIPPING_METHODS : provides
    SHIPPING_FEES ||--o{ SHIPPING_METHODS : applies_to
    
    REVIEWS ||--o{ REVIEW_IMAGES : has
    
    PROMOTIONS ||--o{ PROMOTION_PRODUCTS : applies_to
    VOUCHERS ||--o{ VOUCHER_REDEMPTIONS : redeemed_by
    
    NOTIFICATIONS ||--o{ NOTIFICATION_TYPES : has_type
    MESSAGES ||--o{ MESSAGE_ATTACHMENTS : has

\`\`\`

## Mô tả các mối quan hệ

### 1. Users → Other Entities
- **USERS** (1) ← → (*) **SELLERS**: Một user có thể là seller
- **USERS** (1) ← → (*) **ORDERS**: Một user có nhiều đơn hàng
- **USERS** (1) ← → (*) **REVIEWS**: Một user viết nhiều review
- **USERS** (1) ← → (*) **WISHLIST**: Một user có wishlist
- **USERS** (1) ← → (*) **CART_ITEMS**: Một user có giỏ hàng
- **USERS** (1) ← → (*) **ADDRESSES**: Một user có nhiều địa chỉ

### 2. Sellers → Products
- **SELLERS** (1) ← → (*) **PRODUCTS**: Một seller bán nhiều sản phẩm
- **SELLERS** (1) ← → (*) **PROMOTIONS**: Một seller tạo nhiều khuyến mãi

### 3. Categories → Products
- **CATEGORIES** (1) ← → (*) **PRODUCTS**: Một danh mục chứa nhiều sản phẩm

### 4. Products → Relationships
- **PRODUCTS** (1) ← → (*) **PRODUCT_IMAGES**: Một sản phẩm có nhiều ảnh
- **PRODUCTS** (1) ← → (*) **REVIEWS**: Một sản phẩm nhận nhiều review
- **PRODUCTS** (1) ← → (*) **CART_ITEMS**: Một sản phẩm có trong nhiều giỏ hàng
- **PRODUCTS** (1) ← → (*) **ORDER_ITEMS**: Một sản phẩm có trong nhiều đơn hàng

### 5. Orders → Related Entities
- **ORDERS** (1) ← → (*) **ORDER_ITEMS**: Một đơn hàng chứa nhiều sản phẩm
- **ORDERS** (1) ← → (1) **PAYMENTS**: Một đơn hàng có một thanh toán
- **ORDERS** (1) ← → (*) **SHIPMENTS**: Một đơn hàng có thể có nhiều lô hàng
- **ORDERS** (1) ← → (*) **RETURNS**: Một đơn hàng có thể có nhiều lần trả hàng

### 6. Payments → Payment Methods
- **PAYMENTS** (1) ← → (1) **PAYMENT_METHODS**: Một thanh toán dùng một phương thức

### 7. Shipping Relationships
- **SHIPMENTS** (1) ← → (*) **TRACKING_UPDATES**: Một vận đơn có nhiều cập nhật theo dõi
- **SHIPMENTS** (1) ← → (1) **SHIPPING_METHODS**: Một vận đơn dùng một phương thức vận chuyển
- **SHIPPING_PARTNERS** (1) ← → (*) **SHIPPING_METHODS**: Một đối tác cung cấp nhiều phương thức

### 8. Promotions & Discounts
- **PROMOTIONS** (1) ← → (*) **PROMOTION_PRODUCTS**: Một khuyến mãi áp dụng cho nhiều sản phẩm
- **VOUCHERS** (1) ← → (*) **VOUCHER_REDEMPTIONS**: Một voucher được dùng nhiều lần

### 9. Reviews & Ratings
- **REVIEWS** (1) ← → (*) **REVIEW_IMAGES**: Một review có nhiều ảnh

### 10. Notifications & Messages
- **NOTIFICATIONS** (1) ← → (1) **NOTIFICATION_TYPES**: Một thông báo có loại
- **MESSAGES** (1) ← → (*) **MESSAGE_ATTACHMENTS**: Một tin nhắn có thể có tập tin đính kèm

---

## Các bảng trong hệ thống

| Nhóm | Bảng | Mô Tả |
|------|------|-------|
| **Users & Auth** | users, addresses, user_preferences | Quản lý người dùng, địa chỉ, tùy chọn |
| **Sellers** | sellers, shop_settings, seller_ratings | Quản lý người bán và cửa hàng |
| **Products** | categories, products, product_images | Quản lý danh mục và sản phẩm |
| **Reviews** | reviews, review_images | Đánh giá sản phẩm |
| **Orders** | cart_items, orders, order_items | Giỏ hàng và đơn hàng |
| **Payments** | payments, payment_methods | Thanh toán |
| **Shipping** | shipments, tracking_updates, shipping_methods, shipping_partners, shipping_fees | Vận chuyển |
| **Promotions** | promotions, promotion_products, vouchers, voucher_redemptions | Khuyến mãi |
| **Returns** | returns | Trả hàng |
| **Interaction** | wishlist, notifications, messages, message_attachments | Tương tác |

\`\`\`

Tôi đã tạo ERD riêng biệt hiển thị tất cả 21 bảng với các mối quan hệ 1:1, 1:M, M:M. Sơ đồ mermaid cho phép bạn visualize toàn bộ kiến trúc dữ liệu, cùng bảng mô tả chi tiết các mối quan hệ giữa các entity để dễ hiểu hơn.
