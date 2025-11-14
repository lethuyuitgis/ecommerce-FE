-- Script hoàn chỉnh để tạo/cập nhật tài khoản Shipper
-- Chạy script này để đảm bảo tài khoản shipper hoạt động đúng

-- BƯỚC 1: Thêm SHIPPER vào enum user_type (nếu chưa có)
ALTER TABLE users 
MODIFY COLUMN user_type ENUM('CUSTOMER', 'SELLER', 'ADMIN', 'SHIPPER') NOT NULL DEFAULT 'CUSTOMER';

-- BƯỚC 2: Tạo hoặc cập nhật tài khoản ship@shopcuathuy.com
-- Kiểm tra xem tài khoản đã tồn tại chưa
SET @email = 'ship@shopcuathuy.com';
SET @exists = (SELECT COUNT(*) FROM users WHERE email = @email);

-- Nếu tài khoản đã tồn tại, cập nhật
UPDATE users 
SET 
    user_type = 'SHIPPER',
    full_name = 'Shipper One',
    password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 123456
    phone = '0905555555',
    status = 'ACTIVE',
    updated_at = NOW()
WHERE email = @email AND @exists > 0;

-- Nếu tài khoản chưa tồn tại, tạo mới
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

-- BƯỚC 3: Tạo hoặc cập nhật tài khoản shipper@shopcuathuy.com (có "er")
SET @email2 = 'shipper@shopcuathuy.com';
SET @exists2 = (SELECT COUNT(*) FROM users WHERE email = @email2);

UPDATE users 
SET 
    user_type = 'SHIPPER',
    full_name = 'Shipper One',
    password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 123456
    phone = '0905555555',
    status = 'ACTIVE',
    updated_at = NOW()
WHERE email = @email2 AND @exists2 > 0;

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

-- BƯỚC 4: Kiểm tra kết quả
SELECT 
    id, 
    email, 
    full_name, 
    user_type, 
    status,
    phone,
    CASE 
        WHEN password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' 
        THEN 'Password OK (123456)' 
        ELSE 'Password DIFFERENT' 
    END as password_status
FROM users 
WHERE email IN ('ship@shopcuathuy.com', 'shipper@shopcuathuy.com');


