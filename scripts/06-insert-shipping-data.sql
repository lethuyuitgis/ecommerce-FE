-- Insert shipping methods
INSERT INTO shipping_methods (name, code, carrier_name, base_price, price_per_km, price_per_kg, min_delivery_days, max_delivery_days, coverage_areas, is_active) VALUES
('GHN - Giao hàng nhanh', 'ghn_standard', 'GHN', 25000, 2000, 5000, 2, 3, '["Vietnam"]', TRUE),
('Shopee Express', 'shopee_express', 'Shopee', 35000, 3000, 6000, 1, 2, '["Ho Chi Minh", "Ha Noi", "Da Nang"]', TRUE),
('Ahamove', 'ahamove_same_day', 'Ahamove', 50000, 5000, 10000, 0, 1, '["Ho Chi Minh", "Ha Noi"]', TRUE),
('J&T Express', 'jt_standard', 'J&T', 20000, 1500, 4000, 2, 4, '["Vietnam"]', TRUE);

-- Insert shipping partners
INSERT INTO shipping_partners (name, code, api_key, contact_email, contact_phone, is_active) VALUES
('Giao Hàng Nhanh', 'GHN', 'ghn_api_key_xxx', 'support@ghnjsc.com', '1900252525', TRUE),
('Shopee Express', 'SHOPEE', 'shopee_api_key_xxx', 'support@shopee.vn', '1900969696', TRUE),
('Ahamove', 'AHAMOVE', 'ahamove_api_key_xxx', 'business@ahamove.com', '1900969696', TRUE),
('J&T Express', 'JT', 'jt_api_key_xxx', 'support@jtexpress.vn', '1900261000', TRUE);

-- Insert sample shipments
INSERT INTO shipments (order_id, shipping_method_id, tracking_number, status, current_location, estimated_delivery_date, shipping_fee, weight, recipient_name, recipient_phone, recipient_address) VALUES
(1, 1, 'GHN123456789', 'in_transit', 'Quận Bình Thạnh, TP.HCM', '2024-01-12', 35000, 0.5, 'Nguyễn Văn A', '0901234567', '123 Đường ABC, Quận 1, TP.HCM'),
(2, 2, 'SHOPEE987654321', 'delivered', 'Quận 1, TP.HCM', '2024-01-10', 45000, 0.8, 'Trần Thị B', '0912345678', '456 Đường XYZ, Quận 3, TP.HCM'),
(3, 3, 'AHA112233445', 'pending', 'Kho Ahamove TP.HCM', '2024-01-11', 60000, 1.2, 'Lê Văn C', '0923456789', '789 Đường DEF, Quận 5, TP.HCM');

-- Insert tracking updates
INSERT INTO tracking_updates (shipment_id, status, location, description) VALUES
(1, 'in_transit', 'Quận Bình Thạnh, TP.HCM', 'Đang giao hàng'),
(1, 'pending', 'Kho GHN TP.HCM', 'Rời kho'),
(1, 'pending', 'Kho GHN TP.HCM', 'Đã tiếp nhận');
