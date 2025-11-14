-- Script để reset mật khẩu cho tài khoản shipper
-- Mật khẩu mới: 123456
-- Hash BCrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Kiểm tra tài khoản hiện tại
SELECT id, email, full_name, user_type, status, password_hash 
FROM users 
WHERE email IN ('ship@shopcuathuy.com', 'shipper@shopcuathuy.com');

-- Reset mật khẩu cho ship@shopcuathuy.com
UPDATE users 
SET 
    password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 123456
    updated_at = NOW()
WHERE email = 'ship@shopcuathuy.com';

-- Reset mật khẩu cho shipper@shopcuathuy.com (nếu có)
UPDATE users 
SET 
    password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: 123456
    updated_at = NOW()
WHERE email = 'shipper@shopcuathuy.com';

-- Kiểm tra kết quả
SELECT id, email, full_name, user_type, status 
FROM users 
WHERE email IN ('ship@shopcuathuy.com', 'shipper@shopcuathuy.com');


