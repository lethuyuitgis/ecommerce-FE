-- Insert Categories
INSERT INTO categories (id, name, slug, icon, image, description) VALUES
('1', 'Điện thoại & Phụ kiện', 'dien-thoai-phu-kien', 'Smartphone', '/category-phone.jpg', 'Điện thoại, tai nghe, sạc và các phụ kiện công nghệ'),
('2', 'Thời trang', 'thoi-trang', 'Shirt', '/category-women-fashion.jpg', 'Quần áo, giày dép, phụ kiện thời trang'),
('3', 'Làm đẹp', 'lam-dep', 'Sparkles', '/category-beauty.jpg', 'Mỹ phẩm, skincare, nước hoa'),
('4', 'Đồ gia dụng', 'do-gia-dung', 'Home', '/category-home.jpg', 'Đồ dùng nhà bếp, nội thất, trang trí'),
('5', 'Thực phẩm', 'thuc-pham', 'Apple', '/category-food.jpg', 'Thực phẩm tươi, đồ uống, đặc sản'),
('6', 'Sách & Văn phòng phẩm', 'sach-van-phong-pham', 'BookOpen', '/category-books.jpg', 'Sách, tập, bút, dụng cụ học tập'),
('7', 'Thể thao', 'the-thao', 'Activity', '/category-sports.jpg', 'Quần áo thể thao, giày, dụng cụ tập luyện'),
('8', 'Đồ chơi', 'do-choi', 'Gamepad2', '/category-toys.jpg', 'Đồ chơi trẻ em, board game, mô hình'),
('9', 'Điện tử', 'dien-tu', 'Zap', '/category-electronics.jpg', 'Laptop, máy tính, thiết bị điện tử');

-- Insert Users
INSERT INTO users (id, email, name, phone, avatar, address, created_at, role) VALUES
('user-1', 'customer1@example.com', 'Nguyễn Văn A', '0912345678', '/user-avatar-1.jpg', '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh', '2024-01-15', 'customer'),
('user-2', 'customer2@example.com', 'Trần Thị B', '0987654321', '/user-avatar-2.jpg', '456 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', '2024-02-20', 'customer'),
('user-3', 'customer3@example.com', 'Lê Văn C', '0901234567', '/user-avatar-3.jpg', '789 Đường Trần Hưng Đạo, Hà Nội', '2024-03-10', 'customer');

-- Insert Sellers
INSERT INTO sellers (id, email, name, phone, avatar, shop_name, description, address, rating, followers, products, created_at, verified) VALUES
('seller-1', 'seller1@shopcuathuy.com', 'Shop Điện Thoại Chính Hãng', '0912345678', '/seller-avatar-1.jpg', 'Shop Điện Thoại Chính Hãng', 'Chuyên bán điện thoại, phụ kiện chính hãng', '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh', 4.9, 15234, 45, '2023-06-15', true),
('seller-2', 'seller2@shopcuathuy.com', 'Fashion Store VN', '0987654321', '/seller-avatar-2.jpg', 'Fashion Store VN', 'Thời trang nam nữ, giày dép, phụ kiện', '456 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', 4.8, 12456, 320, '2023-08-20', true),
('seller-3', 'seller3@shopcuathuy.com', 'Beauty & Cosmetics', '0901234567', '/seller-avatar-3.jpg', 'Beauty & Cosmetics', 'Mỹ phẩm, skincare, nước hoa chính hãng', '789 Đường Trần Hưng Đạo, Hà Nội', 4.7, 8934, 156, '2023-09-10', true);
