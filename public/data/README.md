# Sample Data Files

Thư mục này chứa các file JSON với dữ liệu mẫu cho ứng dụng e-commerce.

## Các file dữ liệu

- `users.json` - Dữ liệu người dùng (admin, sellers, customers)
- `categories.json` - Danh mục sản phẩm (danh mục chính và danh mục con)
- `sellers.json` - Thông tin người bán/shop
- `products.json` - Sản phẩm mẫu
- `product-images.json` - Hình ảnh sản phẩm
- `shipping-methods.json` - Phương thức vận chuyển
- `payment-methods.json` - Phương thức thanh toán
- `user-addresses.json` - Địa chỉ người dùng

## Thông tin đăng nhập mẫu

Tất cả tài khoản đều dùng password: `123456`

- **Admin**: `admin@shopcuathuy.com` / `123456`
- **Seller 1**: `seller1@shopcuathuy.com` / `123456`
- **Seller 2**: `seller2@shopcuathuy.com` / `123456`
- **Customer 1**: `customer1@shopcuathuy.com` / `123456`
- **Customer 2**: `customer2@shopcuathuy.com` / `123456`

## Cách sử dụng

### Option 1: Import vào database (Backend)

Sử dụng các file JSON này để tạo script import vào MySQL hoặc sử dụng trong backend để seed data.

### Option 2: Sử dụng trong Frontend (Mock Data)

Có thể import các file JSON này trong frontend để sử dụng làm mock data khi phát triển.

\`\`\`typescript
import users from '@/public/data/users.json'
import products from '@/public/data/products.json'
\`\`\`

## Lưu ý

- Tất cả UUID đều dùng định dạng `CHAR(36)` trong database
- Password đã được hash bằng BCrypt
- Foreign keys đã được liên kết đúng với các bảng liên quan









