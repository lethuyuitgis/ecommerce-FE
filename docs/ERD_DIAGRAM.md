# ShopCuaThuy - Entity Relationship Diagram (ERD)

## System Architecture Overview

\`\`\`mermaid
erDiagram
    USERS ||--o{ USER_ADDRESSES : has
    USERS ||--o{ ORDERS : places
    USERS ||--o{ SELLERS : creates
    USERS ||--o{ PRODUCT_REVIEWS : writes
    USERS ||--o{ SELLER_REVIEWS : writes
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ MESSAGES : sends
    USERS ||--o{ CONVERSATIONS : participates
    USERS ||--o{ ADMIN_LOGS : performs

    SELLERS ||--o{ PRODUCTS : sells
    SELLERS ||--o{ ORDERS : receives
    SELLERS ||--o{ PROMOTIONS : creates
    SELLERS ||--o{ VOUCHERS : creates
    SELLERS ||--o{ SELLER_BANK_ACCOUNTS : owns
    SELLERS ||--o{ SHIPPING_FEES : configures
    SELLERS ||--o{ SELLER_REVIEWS : receives
    SELLERS ||--o{ CONVERSATIONS : participates

    CATEGORIES ||--o{ PRODUCTS : contains
    CATEGORIES ||--o{ CATEGORIES : "subcategory"

    PRODUCTS ||--o{ PRODUCT_IMAGES : has
    PRODUCTS ||--o{ PRODUCT_VARIANTS : has
    PRODUCTS ||--o{ PRODUCT_REVIEWS : receives
    PRODUCTS ||--o{ INVENTORY_HISTORY : tracks
    PRODUCTS ||--o{ PROMOTION_ITEMS : included_in

    PRODUCT_VARIANTS ||--o{ INVENTORY_HISTORY : tracks
    PRODUCT_VARIANTS ||--o{ PROMOTION_ITEMS : included_in

    PRODUCT_REVIEWS ||--o{ REVIEW_IMAGES : has
    PRODUCT_REVIEWS }o--|| ORDER_ITEMS : references

    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ ORDER_TIMELINE : has
    ORDERS ||--o{ PAYMENT_TRANSACTIONS : has
    ORDERS ||--o{ SHIPMENTS : includes
    ORDERS ||--|| REFUNDS : may_have
    ORDERS }o--|| VOUCHER_USAGES : uses
    ORDERS ||--o{ SELLER_REVIEWS : receives
    ORDERS ||--o{ CONVERSATIONS : related_to

    ORDER_ITEMS }o--|| PRODUCT_VARIANTS : "uses"

    PAYMENT_METHODS ||--o{ PAYMENT_TRANSACTIONS : processes

    PAYMENT_TRANSACTIONS ||--|| REFUNDS : "refund_from"

    PROMOTIONS ||--o{ PROMOTION_ITEMS : includes

    VOUCHERS ||--o{ VOUCHER_USAGES : has

    SHIPPING_METHODS ||--o{ SHIPMENTS : used_for
    SHIPPING_METHODS ||--o{ SHIPPING_FEES : defines

    SHIPPING_PARTNERS ||--o{ SHIPMENTS : manages

    SHIPMENTS ||--o{ TRACKING_UPDATES : has

    CONVERSATIONS ||--o{ MESSAGES : contains
\`\`\`

## Database Tables Grouped by Module

### 1. User Management Module
- **users** - Core user accounts
- **user_addresses** - Multiple delivery addresses
- **sellers** - Seller shop profiles
- **seller_bank_accounts** - Payment accounts

### 2. Product Management Module
- **categories** - Product categories (with hierarchy)
- **products** - Product listings
- **product_images** - Product photos
- **product_variants** - Size, color variations
- **inventory_history** - Stock tracking

### 3. Review & Rating Module
- **product_reviews** - Customer reviews for products
- **review_images** - Review photos
- **seller_reviews** - Customer reviews for sellers

### 4. Order Management Module
- **orders** - Main order records
- **order_items** - Individual items in orders
- **order_timeline** - Order status history

### 5. Payment Module
- **payment_methods** - Available payment options
- **payment_transactions** - Payment records
- **refunds** - Refund tracking

### 6. Promotion & Discount Module
- **promotions** - Time-based product promotions
- **promotion_items** - Products in promotions
- **vouchers** - Discount codes
- **voucher_usages** - Voucher usage tracking

### 7. Shipping & Logistics Module
- **shipping_methods** - Shipping options (GHN, J&T, etc)
- **shipping_partners** - Logistics partner integrations
- **shipments** - Shipping records
- **tracking_updates** - Real-time tracking
- **shipping_fees** - Shipping rates by region

### 8. Notification & Communication Module
- **notifications** - System notifications
- **messages** - Chat messages
- **conversations** - Chat sessions

### 9. Admin & Audit Module
- **admin_logs** - Admin action audit trail

## Key Relationships

### One-to-Many (1:M)
- Users → Orders (customers place multiple orders)
- Users → Sellers (users can be sellers)
- Sellers → Products (sellers sell multiple products)
- Products → Product Images (multiple photos per product)
- Products → Reviews (multiple reviews per product)
- Orders → Order Items (multiple items per order)
- Orders → Shipments (potentially multiple shipments)
- Categories → Products (multiple products per category)

### One-to-One (1:1)
- Users → Sellers (one-to-one relationship, user_id is UNIQUE in sellers)
- Orders → Refunds (each order has at most one refund)
- Order Items → Reviews (each item can be reviewed once)

### Many-to-Many (M:M) - Implemented via Junction Tables
- Products ↔ Promotions (via promotion_items)
- Vouchers ↔ Customers (via voucher_usages)

### Self-Join (Hierarchical)
- Categories → Categories (parent_id creates category hierarchy)

## Data Flow

\`\`\`
Customer Registration
    ↓
User Account + User Addresses
    ↓
Browse Products (Products → Categories, Reviews)
    ↓
Add to Cart
    ↓
Checkout (Apply Vouchers)
    ↓
Payment (Payment Methods → Transactions)
    ↓
Order Created
    ↓
Order Timeline + Shipments
    ↓
Tracking Updates (Real-time)
    ↓
Delivery
    ↓
Review & Rating
    ↓
Refund (if applicable)
\`\`\`

## Seller Data Flow

\`\`\`
Seller Registration
    ↓
Seller Profile + Bank Account
    ↓
Add Products
    ↓
Manage Inventory
    ↓
Create Promotions/Vouchers
    ↓
View Orders
    ↓
Manage Shipping
    ↓
Track Revenue & Analytics
\`\`\`

## Performance Optimization

### Indexing Strategy
- **Primary Keys**: All UUID for scalability
- **Foreign Keys**: Indexed for JOIN performance
- **Frequently Queried Columns**: 
  - users.email, users.user_type
  - products.seller_id, products.category_id
  - orders.customer_id, orders.status
  - shipments.tracking_number

### Query Optimization
- Product search uses category + filters
- Order queries use customer_id + created_at
- Real-time tracking uses shipment_id
- User notifications filtered by recipient_id + is_read

## Security Considerations

- **Password**: Stored as hash (not plaintext)
- **Sensitive Data**: Bank accounts, API keys encrypted
- **PII**: Phone numbers, addresses protected
- **Audit Trail**: All admin actions logged
- **RLS** (Row Level Security): Can be implemented per user_type

## Scalability Features

- UUID primary keys allow distributed databases
- Foreign key relationships enable data integrity
- Indexes on frequently joined columns
- Denormalized fields (rating, total_orders) for performance
- JSON columns for flexible attributes (variants, promotions)
