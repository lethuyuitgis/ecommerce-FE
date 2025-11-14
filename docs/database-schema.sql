-- ============================================================
--  E-COMMERCE PLATFORM - DATABASE SCHEMA (MySQL 8.x)
--  Generated as a reference script for project planning
--  Grouped by functional domains (AUTH, SELLER, CATALOG, etc.)
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ------------------------------------------------------------
--  AUTHENTICATION & IDENTITY
-- ------------------------------------------------------------

CREATE TABLE roles (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  code          VARCHAR(32) NOT NULL UNIQUE,
  name          VARCHAR(64) NOT NULL,
  description   VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE users (
  id                  BINARY(16) PRIMARY KEY,               -- UUID
  email               VARCHAR(191) NOT NULL UNIQUE,
  password_hash       VARCHAR(191) NOT NULL,
  full_name           VARCHAR(120) NOT NULL,
  phone_number        VARCHAR(20),
  user_type           ENUM('CUSTOMER','SELLER','SHIPPER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  status              ENUM('ACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  last_login_at       DATETIME,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE user_roles (
  user_id     BINARY(16) NOT NULL,
  role_id     BIGINT NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY(user_id) REFERENCES users(id),
  CONSTRAINT fk_user_roles_role FOREIGN KEY(role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  SELLER MANAGEMENT
-- ------------------------------------------------------------

CREATE TABLE seller_profiles (
  id                BINARY(16) PRIMARY KEY,
  user_id           BINARY(16) NOT NULL UNIQUE,
  shop_name         VARCHAR(150) NOT NULL,
  slug              VARCHAR(191) NOT NULL UNIQUE,
  description       TEXT,
  logo_url          VARCHAR(255),
  address           VARCHAR(255),
  tax_id            VARCHAR(64),
  status            ENUM('DRAFT','PENDING_REVIEW','APPROVED','SUSPENDED') DEFAULT 'DRAFT',
  approved_at       DATETIME,
  rejected_reason   VARCHAR(255),
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_seller_profiles_user FOREIGN KEY(user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE seller_documents (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  seller_id      BINARY(16) NOT NULL,
  document_type  ENUM('ID_CARD','BUSINESS_LICENSE','BANK_STATEMENT','OTHER') NOT NULL,
  document_url   VARCHAR(255) NOT NULL,
  status         ENUM('UPLOADED','APPROVED','REJECTED') DEFAULT 'UPLOADED',
  reviewed_by    BINARY(16),
  reviewed_at    DATETIME,
  notes          VARCHAR(255),
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_seller_documents_seller FOREIGN KEY(seller_id) REFERENCES seller_profiles(id),
  CONSTRAINT fk_seller_documents_reviewer FOREIGN KEY(reviewed_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE seller_settings (
  seller_id        BINARY(16) PRIMARY KEY,
  return_policy    TEXT,
  shipping_policy  TEXT,
  payment_methods  JSON,
  notification_prefs JSON,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_seller_settings_seller FOREIGN KEY(seller_id) REFERENCES seller_profiles(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  PRODUCT CATALOG
-- ------------------------------------------------------------

CREATE TABLE categories (
  id             BINARY(16) PRIMARY KEY,
  parent_id      BINARY(16),
  name           VARCHAR(150) NOT NULL,
  slug           VARCHAR(191) NOT NULL UNIQUE,
  description    TEXT,
  icon           VARCHAR(64),
  cover_image    VARCHAR(255),
  display_order  INT DEFAULT 0,
  is_active      TINYINT(1) DEFAULT 1,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_categories_parent FOREIGN KEY(parent_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE products (
  id              BINARY(16) PRIMARY KEY,
  seller_id       BINARY(16) NOT NULL,
  category_id     BINARY(16) NOT NULL,
  name            VARCHAR(191) NOT NULL,
  slug            VARCHAR(191) NOT NULL UNIQUE,
  description     LONGTEXT,
  sku             VARCHAR(64) UNIQUE,
  price           DECIMAL(12,2) NOT NULL,
  compare_price   DECIMAL(12,2),
  status          ENUM('DRAFT','ACTIVE','INACTIVE','ARCHIVED') DEFAULT 'DRAFT',
  total_sold      INT DEFAULT 0,
  total_reviews   INT DEFAULT 0,
  rating          DECIMAL(3,2) DEFAULT 0,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_seller FOREIGN KEY(seller_id) REFERENCES seller_profiles(id),
  CONSTRAINT fk_products_category FOREIGN KEY(category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE product_variants (
  id            BINARY(16) PRIMARY KEY,
  product_id    BINARY(16) NOT NULL,
  sku           VARCHAR(64) UNIQUE,
  option_values JSON NOT NULL,                -- e.g. {"size":"M","color":"Blue"}
  price         DECIMAL(12,2),
  quantity      INT DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_variants_product FOREIGN KEY(product_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE product_images (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id    BINARY(16) NOT NULL,
  image_url     VARCHAR(255) NOT NULL,
  is_primary    TINYINT(1) DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_images_product FOREIGN KEY(product_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE inventory_snapshots (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id   BINARY(16) NOT NULL,
  variant_id   BINARY(16),
  quantity     INT NOT NULL,
  change_type  ENUM('STOCK_ADJUSTMENT','ORDER_PLACED','ORDER_CANCELLED','RETURNED'),
  reference_id BINARY(16),
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_product FOREIGN KEY(product_id) REFERENCES products(id),
  CONSTRAINT fk_inventory_variant FOREIGN KEY(variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  ORDER & PAYMENT
-- ------------------------------------------------------------

CREATE TABLE orders (
  id                BINARY(16) PRIMARY KEY,
  customer_id       BINARY(16) NOT NULL,
  seller_id         BINARY(16) NOT NULL,
  order_number      VARCHAR(32) NOT NULL UNIQUE,
  status            ENUM('PENDING','CONFIRMED','PACKED','SHIPPED','DELIVERED','CANCELLED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  payment_status    ENUM('UNPAID','PAID','REFUNDING','REFUNDED') DEFAULT 'UNPAID',
  shipping_address  JSON NOT NULL,
  billing_address   JSON,
  subtotal_amount   DECIMAL(12,2) NOT NULL,
  discount_amount   DECIMAL(12,2) DEFAULT 0,
  shipping_fee      DECIMAL(12,2) DEFAULT 0,
  total_amount      DECIMAL(12,2) NOT NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer FOREIGN KEY(customer_id) REFERENCES users(id),
  CONSTRAINT fk_orders_seller FOREIGN KEY(seller_id) REFERENCES seller_profiles(id)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id       BINARY(16) NOT NULL,
  product_id     BINARY(16) NOT NULL,
  variant_id     BINARY(16),
  product_name   VARCHAR(191) NOT NULL,
  sku            VARCHAR(64),
  price          DECIMAL(12,2) NOT NULL,
  quantity       INT NOT NULL,
  total_amount   DECIMAL(12,2) NOT NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order FOREIGN KEY(order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_items_product FOREIGN KEY(product_id) REFERENCES products(id),
  CONSTRAINT fk_order_items_variant FOREIGN KEY(variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB;

CREATE TABLE payments (
  id              BINARY(16) PRIMARY KEY,
  order_id        BINARY(16) NOT NULL,
  payment_method  ENUM('COD','VNPAY','MOMO','PAYPAL','BANK_TRANSFER') NOT NULL,
  amount          DECIMAL(12,2) NOT NULL,
  status          ENUM('INITIATED','SUCCESS','FAILED','REFUNDED') NOT NULL,
  transaction_ref VARCHAR(128),
  paid_at         DATETIME,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order FOREIGN KEY(order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

CREATE TABLE vouchers (
  id             BINARY(16) PRIMARY KEY,
  code           VARCHAR(32) NOT NULL UNIQUE,
  description    VARCHAR(255),
  type           ENUM('PERCENTAGE','FIXED','FREESHIP') NOT NULL,
  value          DECIMAL(12,2) NOT NULL,
  max_discount   DECIMAL(12,2),
  min_order_value DECIMAL(12,2),
  usage_limit    INT DEFAULT 0,
  used_count     INT DEFAULT 0,
  start_date     DATETIME,
  end_date       DATETIME,
  created_by     BINARY(16),
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_vouchers_admin FOREIGN KEY(created_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE order_vouchers (
  order_id    BINARY(16) NOT NULL,
  voucher_id  BINARY(16) NOT NULL,
  discount    DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (order_id, voucher_id),
  CONSTRAINT fk_order_vouchers_order FOREIGN KEY(order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_vouchers_voucher FOREIGN KEY(voucher_id) REFERENCES vouchers(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  SHIPPING & LOGISTICS
-- ------------------------------------------------------------

CREATE TABLE shipments (
  id                BINARY(16) PRIMARY KEY,
  order_id          BINARY(16) NOT NULL,
  seller_id         BINARY(16) NOT NULL,
  shipper_id        BINARY(16),
  tracking_number   VARCHAR(64) UNIQUE,
  status            ENUM('READY_FOR_PICKUP','PICKED_UP','IN_TRANSIT','ARRIVED_HUB','OUT_FOR_DELIVERY','DELIVERED','FAILED','CANCELLED') NOT NULL DEFAULT 'READY_FOR_PICKUP',
  pickup_address    JSON NOT NULL,
  delivery_address  JSON NOT NULL,
  package_weight    DECIMAL(8,2),
  package_size      VARCHAR(64),
  cod_amount        DECIMAL(12,2) DEFAULT 0,
  notes             VARCHAR(255),
  created_by        BINARY(16) NOT NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_shipments_order FOREIGN KEY(order_id) REFERENCES orders(id),
  CONSTRAINT fk_shipments_seller FOREIGN KEY(seller_id) REFERENCES seller_profiles(id),
  CONSTRAINT fk_shipments_shipper FOREIGN KEY(shipper_id) REFERENCES users(id),
  CONSTRAINT fk_shipments_admin FOREIGN KEY(created_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE shipment_events (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  shipment_id   BINARY(16) NOT NULL,
  status        VARCHAR(32) NOT NULL,
  description   VARCHAR(255),
  location      VARCHAR(120),
  event_time    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  recorded_by   BINARY(16),
  CONSTRAINT fk_shipment_events_shipment FOREIGN KEY(shipment_id) REFERENCES shipments(id),
  CONSTRAINT fk_shipment_events_user FOREIGN KEY(recorded_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  REVIEWS & FEEDBACK
-- ------------------------------------------------------------

CREATE TABLE reviews (
  id            BINARY(16) PRIMARY KEY,
  order_item_id BIGINT NOT NULL,
  product_id    BINARY(16) NOT NULL,
  customer_id   BINARY(16) NOT NULL,
  rating        INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title         VARCHAR(150),
  comment       TEXT,
  images        JSON,
  videos        JSON,
  helpful_count INT DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_order_item FOREIGN KEY(order_item_id) REFERENCES order_items(id),
  CONSTRAINT fk_reviews_product FOREIGN KEY(product_id) REFERENCES products(id),
  CONSTRAINT fk_reviews_customer FOREIGN KEY(customer_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  MESSAGING & NOTIFICATIONS
-- ------------------------------------------------------------

CREATE TABLE conversations (
  id            BINARY(16) PRIMARY KEY,
  customer_id   BINARY(16) NOT NULL,
  seller_id     BINARY(16) NOT NULL,
  last_message  TEXT,
  last_sent_at  DATETIME,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_conversations_customer FOREIGN KEY(customer_id) REFERENCES users(id),
  CONSTRAINT fk_conversations_seller FOREIGN KEY(seller_id) REFERENCES seller_profiles(id)
) ENGINE=InnoDB;

CREATE TABLE messages (
  id               BINARY(16) PRIMARY KEY,
  conversation_id  BINARY(16) NOT NULL,
  sender_id        BINARY(16) NOT NULL,
  recipient_id     BINARY(16) NOT NULL,
  content          TEXT NOT NULL,
  attachments      JSON,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at          DATETIME,
  CONSTRAINT fk_messages_conversation FOREIGN KEY(conversation_id) REFERENCES conversations(id),
  CONSTRAINT fk_messages_sender FOREIGN KEY(sender_id) REFERENCES users(id),
  CONSTRAINT fk_messages_recipient FOREIGN KEY(recipient_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id            BINARY(16) PRIMARY KEY,
  recipient_id  BINARY(16) NOT NULL,
  type          VARCHAR(64) NOT NULL,
  title         VARCHAR(191),
  message       TEXT,
  data          JSON,
  is_read       TINYINT(1) DEFAULT 0,
  read_at       DATETIME,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY(recipient_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
--  SYSTEM LOGGING & AUDIT
-- ------------------------------------------------------------

CREATE TABLE admin_audit_logs (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  admin_id      BINARY(16) NOT NULL,
  action        VARCHAR(128) NOT NULL,
  entity_type   VARCHAR(64),
  entity_id     VARCHAR(64),
  details       JSON,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_audit_admin FOREIGN KEY(admin_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE integration_jobs (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  job_type       VARCHAR(64) NOT NULL,
  payload        JSON,
  status         ENUM('PENDING','PROCESSING','SUCCESS','FAILED') NOT NULL DEFAULT 'PENDING',
  retry_count    INT DEFAULT 0,
  next_retry_at  DATETIME,
  last_error     TEXT,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- End of schema
-- ============================================================

