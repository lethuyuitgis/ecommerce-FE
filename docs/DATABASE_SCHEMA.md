# ShopCuaThuy - Complete Database Schema

## Overview
Complete e-commerce database with 21 tables supporting users, products, orders, sellers, payments, and logistics.

---

## 1. USERS & AUTHENTICATION

### users
Stores all user accounts and authentication information.
- id (UUID, PRIMARY KEY)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- phone (VARCHAR)
- avatar_url (VARCHAR)
- date_of_birth (DATE)
- gender (ENUM: male, female, other)
- user_type (ENUM: customer, seller, admin)
- status (ENUM: active, inactive, banned)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### user_addresses
Multiple delivery addresses per user.
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY -> users)
- address_type (ENUM: home, office, other)
- full_name (VARCHAR)
- phone (VARCHAR)
- province (VARCHAR)
- district (VARCHAR)
- ward (VARCHAR)
- street (VARCHAR)
- is_default (BOOLEAN)
- created_at (TIMESTAMP)

---

## 2. SELLERS & SHOPS

### sellers
Shop/Seller information.
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY -> users, UNIQUE)
- shop_name (VARCHAR)
- shop_description (TEXT)
- shop_avatar (VARCHAR)
- shop_cover (VARCHAR)
- shop_phone (VARCHAR)
- shop_email (VARCHAR)
- province (VARCHAR)
- district (VARCHAR)
- verification_status (ENUM: unverified, pending, verified, rejected)
- verification_document (VARCHAR)
- rating (DECIMAL)
- total_products (INT)
- total_followers (INT)
- total_orders (INT)
- response_time (INT) -- in hours
- response_rate (DECIMAL)
- on_time_delivery_rate (DECIMAL)
- return_rate (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### seller_bank_accounts
Bank information for payouts.
- id (UUID, PRIMARY KEY)
- seller_id (UUID, FOREIGN KEY -> sellers)
- bank_name (VARCHAR)
- account_number (VARCHAR)
- account_holder (VARCHAR)
- is_default (BOOLEAN)
- created_at (TIMESTAMP)

---

## 3. PRODUCTS & CATEGORIES

### categories
Product categories.
- id (UUID, PRIMARY KEY)
- name (VARCHAR, UNIQUE)
- slug (VARCHAR, UNIQUE)
- description (TEXT)
- icon (VARCHAR)
- cover_image (VARCHAR)
- parent_id (UUID, FOREIGN KEY -> categories) -- for subcategories
- display_order (INT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)

### products
Product listings.
- id (UUID, PRIMARY KEY)
- seller_id (UUID, FOREIGN KEY -> sellers)
- category_id (UUID, FOREIGN KEY -> categories)
- name (VARCHAR)
- description (TEXT)
- sku (VARCHAR, UNIQUE)
- price (DECIMAL)
- compare_price (DECIMAL) -- original price before discount
- cost (DECIMAL)
- quantity (INT)
- min_order (INT)
- status (ENUM: active, inactive, out_of_stock, discontinued)
- rating (DECIMAL)
- total_reviews (INT)
- total_sold (INT)
- total_views (INT)
- is_featured (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### product_images
Multiple images per product.
- id (UUID, PRIMARY KEY)
- product_id (UUID, FOREIGN KEY -> products)
- image_url (VARCHAR)
- alt_text (VARCHAR)
- display_order (INT)
- is_primary (BOOLEAN)

### product_variants
Product variations (size, color, etc).
- id (UUID, PRIMARY KEY)
- product_id (UUID, FOREIGN KEY -> products)
- variant_name (VARCHAR) -- e.g., "Red - Size M"
- variant_sku (VARCHAR)
- variant_price (DECIMAL)
- variant_quantity (INT)
- variant_image (VARCHAR)
- attributes (JSON) -- {color: "red", size: "M"}
- created_at (TIMESTAMP)

### inventory_history
Track inventory changes.
- id (UUID, PRIMARY KEY)
- product_id (UUID, FOREIGN KEY -> products)
- variant_id (UUID, FOREIGN KEY -> product_variants)
- quantity_change (INT)
- reason (ENUM: purchase, return, adjustment, restock, damage)
- reference_id (VARCHAR) -- order_id or adjustment_id
- created_at (TIMESTAMP)

---

## 4. REVIEWS & RATINGS

### product_reviews
Customer reviews for products.
- id (UUID, PRIMARY KEY)
- product_id (UUID, FOREIGN KEY -> products)
- order_item_id (UUID, FOREIGN KEY -> order_items)
- customer_id (UUID, FOREIGN KEY -> users)
- rating (INT) -- 1-5 stars
- title (VARCHAR)
- comment (TEXT)
- images (JSON) -- array of image URLs
- helpful_count (INT)
- status (ENUM: pending, approved, rejected)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### review_images
Images attached to reviews.
- id (UUID, PRIMARY KEY)
- review_id (UUID, FOREIGN KEY -> product_reviews)
- image_url (VARCHAR)
- created_at (TIMESTAMP)

### seller_reviews
Customer reviews for sellers.
- id (UUID, PRIMARY KEY)
- seller_id (UUID, FOREIGN KEY -> sellers)
- order_id (UUID, FOREIGN KEY -> orders)
- customer_id (UUID, FOREIGN KEY -> users)
- rating (INT) -- 1-5 stars
- comment (TEXT)
- aspect (VARCHAR) -- "communication", "delivery", "quality"
- created_at (TIMESTAMP)

---

## 5. ORDERS & TRANSACTIONS

### orders
Main order records.
- id (UUID, PRIMARY KEY)
- order_number (VARCHAR, UNIQUE) -- e.g., SHO20250108001
- customer_id (UUID, FOREIGN KEY -> users)
- seller_id (UUID, FOREIGN KEY -> sellers)
- status (ENUM: pending, confirmed, shipped, delivered, cancelled, returned)
- payment_status (ENUM: pending, paid, failed, refunded)
- shipping_status (ENUM: pending, picked_up, in_transit, delivered, failed)
- total_price (DECIMAL)
- subtotal (DECIMAL)
- discount_amount (DECIMAL)
- shipping_fee (DECIMAL)
- tax (DECIMAL)
- final_total (DECIMAL)
- payment_method (VARCHAR) -- "cod", "transfer", "momo", "zalopay"
- notes (TEXT)
- customer_notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### order_items
Individual items in orders.
- id (UUID, PRIMARY KEY)
- order_id (UUID, FOREIGN KEY -> orders)
- product_id (UUID, FOREIGN KEY -> products)
- variant_id (UUID, FOREIGN KEY -> product_variants)
- quantity (INT)
- unit_price (DECIMAL)
- total_price (DECIMAL)
- created_at (TIMESTAMP)

### order_timeline
Status history for orders.
- id (UUID, PRIMARY KEY)
- order_id (UUID, FOREIGN KEY -> orders)
- status (VARCHAR)
- note (TEXT)
- created_by (VARCHAR) -- "system", "customer", "seller", "admin"
- created_at (TIMESTAMP)

---

## 6. PAYMENTS

### payment_methods
Supported payment methods.
- id (UUID, PRIMARY KEY)
- method_code (VARCHAR, UNIQUE) -- "cod", "transfer", "momo", "zalopay", "paypal"
- method_name (VARCHAR)
- description (TEXT)
- icon (VARCHAR)
- is_active (BOOLEAN)
- min_amount (DECIMAL)
- max_amount (DECIMAL)
- fee_percentage (DECIMAL)
- fee_fixed (DECIMAL)

### payment_transactions
Payment transaction records.
- id (UUID, PRIMARY KEY)
- order_id (UUID, FOREIGN KEY -> orders)
- payment_method_id (UUID, FOREIGN KEY -> payment_methods)
- amount (DECIMAL)
- transaction_code (VARCHAR, UNIQUE)
- status (ENUM: pending, completed, failed, cancelled, refunded)
- bank_code (VARCHAR)
- bank_transaction_id (VARCHAR)
- error_message (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### refunds
Refund requests and tracking.
- id (UUID, PRIMARY KEY)
- order_id (UUID, FOREIGN KEY -> orders)
- payment_transaction_id (UUID, FOREIGN KEY -> payment_transactions)
- reason (VARCHAR)
- amount (DECIMAL)
- status (ENUM: pending, approved, rejected, completed)
- refund_date (TIMESTAMP)
- created_at (TIMESTAMP)

---

## 7. PROMOTIONS & DISCOUNTS

### promotions
Product-specific promotions.
- id (UUID, PRIMARY KEY)
- seller_id (UUID, FOREIGN KEY -> sellers)
- name (VARCHAR)
- description (TEXT)
- promotion_type (ENUM: percentage, fixed_amount, buy_x_get_y)
- discount_value (DECIMAL)
- max_discount_amount (DECIMAL)
- min_purchase_amount (DECIMAL)
- start_date (TIMESTAMP)
- end_date (TIMESTAMP)
- quantity_limit (INT)
- quantity_used (INT)
- status (ENUM: active, scheduled, ended, cancelled)
- created_at (TIMESTAMP)

### promotion_items
Products included in promotions.
- id (UUID, PRIMARY KEY)
- promotion_id (UUID, FOREIGN KEY -> promotions)
- product_id (UUID, FOREIGN KEY -> products)
- variant_id (UUID, FOREIGN KEY -> product_variants)

### vouchers
Discount codes/vouchers.
- id (UUID, PRIMARY KEY)
- seller_id (UUID, FOREIGN KEY -> sellers)
- code (VARCHAR, UNIQUE)
- description (TEXT)
- discount_type (ENUM: percentage, fixed_amount, free_shipping)
- discount_value (DECIMAL)
- min_purchase_amount (DECIMAL)
- max_uses_per_customer (INT)
- total_uses_limit (INT)
- total_uses (INT)
- start_date (TIMESTAMP)
- end_date (TIMESTAMP)
- applicable_categories (JSON) -- array of category_ids
- status (ENUM: active, inactive, expired)
- created_at (TIMESTAMP)

### voucher_usages
Track voucher usage per customer.
- id (UUID, PRIMARY KEY)
- voucher_id (UUID, FOREIGN KEY -> vouchers)
- customer_id (UUID, FOREIGN KEY -> users)
- order_id (UUID, FOREIGN KEY -> orders)
- discount_amount (DECIMAL)
- used_at (TIMESTAMP)

---

## 8. SHIPPING & LOGISTICS

### shipping_methods
Available shipping methods.
- id (UUID, PRIMARY KEY)
- code (VARCHAR, UNIQUE) -- "ghn", "shopee_express", "ahamove", "j&t"
- name (VARCHAR)
- description (TEXT)
- logo (VARCHAR)
- is_active (BOOLEAN)
- min_weight (DECIMAL) -- in kg
- max_weight (DECIMAL)
- min_delivery_days (INT)
- max_delivery_days (INT)
- created_at (TIMESTAMP)

### shipping_partners
Logistics company integrations.
- id (UUID, PRIMARY KEY)
- partner_name (VARCHAR)
- partner_code (VARCHAR, UNIQUE)
- api_key (VARCHAR)
- api_secret (VARCHAR)
- is_active (BOOLEAN)
- contact_email (VARCHAR)
- created_at (TIMESTAMP)

### shipments
Shipping records per order.
- id (UUID, PRIMARY KEY)
- order_id (UUID, FOREIGN KEY -> orders)
- shipping_method_id (UUID, FOREIGN KEY -> shipping_methods)
- shipping_partner_id (UUID, FOREIGN KEY -> shipping_partners)
- tracking_number (VARCHAR, UNIQUE)
- sender_name (VARCHAR)
- sender_phone (VARCHAR)
- recipient_name (VARCHAR)
- recipient_phone (VARCHAR)
- recipient_address (TEXT)
- recipient_province (VARCHAR)
- recipient_district (VARCHAR)
- recipient_ward (VARCHAR)
- weight (DECIMAL) -- in kg
- shipping_fee (DECIMAL)
- insurance_fee (DECIMAL)
- status (ENUM: pending, picked_up, in_transit, out_for_delivery, delivered, failed, returned)
- expected_delivery_date (DATE)
- actual_delivery_date (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### tracking_updates
Real-time tracking updates.
- id (UUID, PRIMARY KEY)
- shipment_id (UUID, FOREIGN KEY -> shipments)
- status (VARCHAR)
- location (VARCHAR)
- description (TEXT)
- timestamp (TIMESTAMP)
- created_at (TIMESTAMP)

### shipping_fees
Shipping fee configurations.
- id (UUID, PRIMARY KEY)
- shipping_method_id (UUID, FOREIGN KEY -> shipping_methods)
- seller_id (UUID, FOREIGN KEY -> sellers)
- province (VARCHAR)
- base_fee (DECIMAL)
- per_km_fee (DECIMAL)
- weight_unit (INT) -- per 500g or 1kg
- weight_fee (DECIMAL)
- created_at (TIMESTAMP)

---

## 9. NOTIFICATIONS & MESSAGES

### notifications
System notifications for users.
- id (UUID, PRIMARY KEY)
- recipient_id (UUID, FOREIGN KEY -> users)
- type (ENUM: order, promotion, system, announcement)
- title (VARCHAR)
- message (TEXT)
- related_id (VARCHAR) -- order_id, promotion_id, etc
- is_read (BOOLEAN)
- created_at (TIMESTAMP)
- read_at (TIMESTAMP)

### messages
Chat messages between customers and sellers.
- id (UUID, PRIMARY KEY)
- conversation_id (UUID, FOREIGN KEY -> conversations)
- sender_id (UUID, FOREIGN KEY -> users)
- receiver_id (UUID, FOREIGN KEY -> users)
- message (TEXT)
- images (JSON) -- array of image URLs
- is_read (BOOLEAN)
- created_at (TIMESTAMP)
- read_at (TIMESTAMP)

### conversations
Chat conversations.
- id (UUID, PRIMARY KEY)
- customer_id (UUID, FOREIGN KEY -> users)
- seller_id (UUID, FOREIGN KEY -> sellers)
- order_id (UUID, FOREIGN KEY -> orders)
- last_message (TEXT)
- last_message_at (TIMESTAMP)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)

---

## 10. ADMIN & SYSTEM

### admin_logs
Admin action logs for audit trail.
- id (UUID, PRIMARY KEY)
- admin_id (UUID, FOREIGN KEY -> users)
- action (VARCHAR)
- resource_type (VARCHAR) -- "order", "product", "user", "seller"
- resource_id (VARCHAR)
- changes (JSON)
- created_at (TIMESTAMP)

---

## Database Indexes

### Performance Indexes
- users: idx_email, idx_user_type, idx_status
- products: idx_seller_id, idx_category_id, idx_status, idx_created_at
- orders: idx_customer_id, idx_seller_id, idx_status, idx_created_at
- order_items: idx_order_id, idx_product_id
- shipments: idx_order_id, idx_tracking_number, idx_status
- messages: idx_conversation_id, idx_sender_id, idx_created_at
- notifications: idx_recipient_id, idx_is_read, idx_created_at

### Foreign Key Indexes
- All FK columns have indexes for JOIN performance

---

## Relationships Summary

\`\`\`
users (1) ──→ (many) user_addresses
users (1) ──→ (many) orders (as customer_id)
users (1) ──→ (many) sellers (as user_id)
users (1) ──→ (many) product_reviews
users (1) ──→ (many) notifications
users (1) ──→ (many) messages

sellers (1) ──→ (many) products
sellers (1) ──→ (many) orders
sellers (1) ──→ (many) promotions
sellers (1) ──→ (many) vouchers

categories (1) ──→ (many) products
categories (1) ──→ (1) categories (parent_id - self-join for subcategories)

products (1) ──→ (many) product_images
products (1) ──→ (many) product_variants
products (1) ──→ (many) product_reviews
products (1) ──→ (many) inventory_history
products (1) ──→ (many) promotion_items

orders (1) ──→ (many) order_items
orders (1) ──→ (many) order_timeline
orders (1) ──→ (many) payment_transactions
orders (1) ──→ (many) shipments
orders (1) ──→ (1) refunds

shipments (1) ──→ (many) tracking_updates
\`\`\`

---

## Statistics & Key Metrics

- **Total Tables**: 21
- **Total Columns**: ~200+
- **Primary Keys**: All UUID for scalability
- **Foreign Keys**: 30+
- **Indexes**: 40+
- **Support for**: Users, Sellers, Products, Orders, Payments, Shipping, Reviews, Promotions, Messages, Notifications
