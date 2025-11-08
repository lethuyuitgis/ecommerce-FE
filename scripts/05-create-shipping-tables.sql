-- Shipping Methods table
CREATE TABLE shipping_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    carrier_name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    price_per_km DECIMAL(10, 2),
    price_per_kg DECIMAL(10, 2),
    min_delivery_days INT,
    max_delivery_days INT,
    coverage_areas JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments table
CREATE TABLE shipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    shipping_method_id INT NOT NULL,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('pending', 'in_transit', 'delivered', 'failed', 'returned') DEFAULT 'pending',
    current_location VARCHAR(255),
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    shipping_fee DECIMAL(10, 2),
    weight DECIMAL(10, 3),
    dimensions JSON,
    recipient_name VARCHAR(100),
    recipient_phone VARCHAR(20),
    recipient_address VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id),
    INDEX (tracking_number),
    INDEX (status),
    INDEX (created_at)
);

-- Tracking Updates table
CREATE TABLE tracking_updates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shipment_id INT NOT NULL,
    status VARCHAR(50),
    location VARCHAR(255),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
    INDEX (shipment_id),
    INDEX (updated_at)
);

-- Shipping Fees table
CREATE TABLE shipping_fees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    shipping_method_id INT NOT NULL,
    base_fee DECIMAL(10, 2),
    weight_based_fee DECIMAL(10, 2),
    distance_based_fee DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id)
);

-- Shipping Partners table
CREATE TABLE shipping_partners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) UNIQUE NOT NULL,
    api_key VARCHAR(255),
    webhook_url VARCHAR(255),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
