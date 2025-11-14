-- Script để tạo tài khoản Shipper
-- Mật khẩu: shipper123 (đã được hash bằng BCrypt)
-- Bạn có thể thay đổi mật khẩu sau khi đăng nhập

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
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: shipper123
    'Shipper One',
    '0901234567',
    'SHIPPER',
    'active',
    NOW(),
    NOW()
);

-- Hoặc nếu bạn muốn tạo thêm tài khoản shipper khác:
-- INSERT INTO users (
--     id,
--     email,
--     password_hash,
--     full_name,
--     phone,
--     user_type,
--     status,
--     created_at,
--     updated_at
-- ) VALUES (
--     UUID(),
--     'shipper2@shopcuathuy.com',
--     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: shipper123
--     'Shipper Two',
--     '0901234568',
--     'SHIPPER',
--     'active',
--     NOW(),
--     NOW()
-- );

-- Lưu ý: Mật khẩu mặc định là "shipper123"
-- Bạn nên đổi mật khẩu sau khi đăng nhập lần đầu


