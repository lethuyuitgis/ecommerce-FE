-- Script để tạo hoặc cập nhật tài khoản Shipper
-- Email: ship@shopcuathuy.com
-- Password: 123456

-- BƯỚC 1: Thêm SHIPPER vào enum user_type (nếu chưa có)
-- Kiểm tra cấu trúc: SHOW COLUMNS FROM users LIKE 'user_type';
ALTER TABLE users 
MODIFY COLUMN user_type ENUM('CUSTOMER', 'SELLER', 'ADMIN', 'SHIPPER') NOT NULL DEFAULT 'CUSTOMER';

-- BƯỚC 2: Cập nhật tài khoản hiện có thành SHIPPER
UPDATE users 
SET 
    user_type = 'SHIPPER',
    full_name = 'Shipper One',
    updated_at = NOW()
WHERE email = 'ship@shopcuathuy.com';

-- Option 2: Tạo tài khoản Shipper mới (nếu chưa tồn tại)
-- Kiểm tra xem email đã tồn tại chưa, nếu chưa thì insert
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
) 
SELECT 
    UUID(),
    'ship@shopcuathuy.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 123456
    'Shipper One',
    '0905555555',
    'SHIPPER',
    'ACTIVE',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'ship@shopcuathuy.com'
);

-- Hoặc nếu bạn muốn tạo tài khoản với email shipper@shopcuathuy.com (có "er"):
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
) 
SELECT 
    UUID(),
    'shipper@shopcuathuy.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 123456
    'Shipper One',
    '0905555555',
    'SHIPPER',
    'ACTIVE',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'shipper@shopcuathuy.com'
);

-- Kiểm tra kết quả
SELECT id, email, full_name, user_type, status 
FROM users 
WHERE email IN ('ship@shopcuathuy.com', 'shipper@shopcuathuy.com');

