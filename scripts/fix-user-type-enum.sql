-- Script để thêm SHIPPER vào enum user_type
-- Kiểm tra cấu trúc hiện tại của bảng users
-- SHOW COLUMNS FROM users LIKE 'user_type';

-- Cách 1: Nếu user_type là ENUM, cần ALTER TABLE để thêm giá trị mới
ALTER TABLE users 
MODIFY COLUMN user_type ENUM('CUSTOMER', 'SELLER', 'ADMIN', 'SHIPPER') NOT NULL DEFAULT 'CUSTOMER';

-- Cách 2: Nếu user_type là VARCHAR, không cần sửa gì, chỉ cần UPDATE
-- UPDATE users 
-- SET 
--     user_type = 'SHIPPER',
--     full_name = 'Shipper One',
--     updated_at = NOW()
-- WHERE email = 'ship@shopcuathuy.com';

-- Sau khi ALTER TABLE, chạy UPDATE:
UPDATE users 
SET 
    user_type = 'SHIPPER',
    full_name = 'Shipper One',
    updated_at = NOW()
WHERE email = 'ship@shopcuathuy.com';

-- Kiểm tra kết quả
SELECT id, email, full_name, user_type, status 
FROM users 
WHERE email = 'ship@shopcuathuy.com';


