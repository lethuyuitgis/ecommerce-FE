# Thông tin tài khoản Shipper

## Tài khoản Shipper

Có 2 tài khoản shipper có thể sử dụng:

### Tài khoản 1 (Email có "er"):
- **Email**: `shipper@shopcuathuy.com`
- **Mật khẩu**: `123456`
- **Tên**: Shipper One
- **Số điện thoại**: 0905555555
- **User Type**: SHIPPER

### Tài khoản 2 (Email không có "er"):
- **Email**: `ship@shopcuathuy.com`
- **Mật khẩu**: `123456`
- **Tên**: Shipper One
- **Số điện thoại**: 0905555555
- **User Type**: SHIPPER

**Lưu ý**: Nếu tài khoản `ship@shopcuathuy.com` đang có `user_type = 'SELLER'`, cần chạy script `scripts/fix-shipper-account.sql` để cập nhật thành `SHIPPER`.

## Cách sử dụng:

1. Truy cập trang đăng nhập: `/login`
2. Nhập email: `shipper@shopcuathuy.com`
3. Nhập mật khẩu: `123456`
4. Sau khi đăng nhập thành công, hệ thống sẽ tự động chuyển đến trang `/ship`

## Tạo tài khoản Shipper mới trong Database:

Nếu bạn muốn tạo tài khoản shipper mới trong database MySQL, chạy script:

```sql
-- File: scripts/create-shipper-account.sql
INSERT INTO users (
    id,
    email,
    password_hash,
    full_name,
    phone,
    user_type,
    status,
    created_at,
    updated_at
) VALUES (
    UUID(),
    'shipper@shopcuathuy.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 123456
    'Shipper One',
    '0905555555',
    'SHIPPER',
    'active',
    NOW(),
    NOW()
);
```

## Lưu ý:

- **Email đúng**: `shipper@shopcuathuy.com` (có "er" ở cuối)
- **Email sai**: `ship@shopcuathuy.com` (thiếu "er")
- Mật khẩu hash `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` tương ứng với mật khẩu `123456`
- Nếu mật khẩu không đúng, bạn có thể cần tạo lại password hash bằng BCrypt
- Sau khi đăng nhập, nên đổi mật khẩu để bảo mật

## Test với curl:

### Test với email có "er":
```bash
curl 'http://localhost:3000/api/auth/login' \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"shipper@shopcuathuy.com","password":"123456"}'
```

### Test với email không có "er":
```bash
curl 'http://localhost:3000/api/auth/login' \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"ship@shopcuathuy.com","password":"123456"}'
```

## Sửa tài khoản nếu user_type sai:

Nếu tài khoản `ship@shopcuathuy.com` đang có `user_type = 'SELLER'`, cần:

### Bước 1: Thêm SHIPPER vào enum user_type

```sql
-- Kiểm tra cấu trúc hiện tại
SHOW COLUMNS FROM users LIKE 'user_type';

-- Thêm SHIPPER vào enum
ALTER TABLE users 
MODIFY COLUMN user_type ENUM('CUSTOMER', 'SELLER', 'ADMIN', 'SHIPPER') NOT NULL DEFAULT 'CUSTOMER';
```

### Bước 2: Cập nhật tài khoản

```sql
UPDATE users 
SET 
    user_type = 'SHIPPER',
    full_name = 'Shipper One',
    updated_at = NOW()
WHERE email = 'ship@shopcuathuy.com';
```

Hoặc chạy file script đầy đủ:
```bash
mysql -u your_user -p your_database < scripts/fix-shipper-account.sql
```

**Lưu ý**: Nếu gặp lỗi "Data truncated for column 'user_type'", có nghĩa là enum chưa có giá trị 'SHIPPER', cần chạy ALTER TABLE trước.

## Nếu gặp lỗi "Invalid email or password":

### Kiểm tra tài khoản trong database:

```sql
SELECT id, email, full_name, user_type, status, password_hash 
FROM users 
WHERE email IN ('ship@shopcuathuy.com', 'shipper@shopcuathuy.com');
```

### Reset mật khẩu:

```sql
-- Reset mật khẩu cho ship@shopcuathuy.com
UPDATE users 
SET 
    password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 123456
    updated_at = NOW()
WHERE email = 'ship@shopcuathuy.com';
```

### Hoặc chạy script hoàn chỉnh:

```bash
mysql -u your_user -p your_database < scripts/create-shipper-complete.sql
```

Script này sẽ:
1. Thêm SHIPPER vào enum user_type
2. Tạo hoặc cập nhật tài khoản với mật khẩu đúng
3. Đảm bảo user_type = 'SHIPPER'
4. Kiểm tra kết quả

## Các tài khoản test khác:

- **Admin**: `admin@shopcuathuy.com` / `123456`
- **Seller 1**: `seller1@shopcuathuy.com` / `123456`
- **Seller 2**: `seller2@shopcuathuy.com` / `123456`
- **Customer 1**: `customer1@shopcuathuy.com` / `123456`
- **Customer 2**: `customer2@shopcuathuy.com` / `123456`
- **Shipper**: `shipper@shopcuathuy.com` / `123456`

