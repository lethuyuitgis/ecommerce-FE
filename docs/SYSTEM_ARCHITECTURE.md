# ShopCuaThuy - System Architecture

## System Overview
ShopCuaThuy là một nền tảng e-commerce đầy đủ với 34 trang, hỗ trợ khách hàng, người bán, và quản trị viên.

## Architecture Layers

### 1. Presentation Layer (Frontend)
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    WEB INTERFACE                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Customer    │  │   Seller     │  │    Admin     │       │
│  │   Pages      │  │   Pages      │  │    Pages     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  - Browse Products          - Manage Products                │
│  - Search & Filter          - Orders Management              │
│  - Product Details          - Analytics Dashboard            │
│  - Shopping Cart            - Seller Settings                │
│  - Checkout                 - Customer Management            │
│  - Order Tracking           - Shipping Management            │
│  - User Profile             - Promotions Management          │
│  - Reviews & Ratings        - Messages                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 2. API Layer (Backend)
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    REST/GraphQL API                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Authentication APIs       │  Payment APIs                  │
│  ├─ Login/Register         │  ├─ Create Payment             │
│  ├─ Token Refresh          │  ├─ Payment Verification       │
│  └─ Profile Management     │  └─ Refund Processing         │
│                            │                                │
│  Product APIs              │  Shipping APIs                │
│  ├─ Get Products           │  ├─ Calculate Shipping Fee    │
│  ├─ Search/Filter          │  ├─ Create Shipment           │
│  ├─ Product Details        │  ├─ Track Package             │
│  └─ Reviews & Ratings      │  └─ Update Tracking           │
│                            │                                │
│  Order APIs                │  Messaging APIs               │
│  ├─ Create Order           │  ├─ Send Message              │
│  ├─ Update Order Status    │  ├─ Get Conversations         │
│  ├─ Cancel Order           │  └─ Mark as Read              │
│  └─ Get Order History      │                                │
│                            │  Seller APIs                   │
│  Promotion APIs            │  ├─ Shop Analytics            │
│  ├─ Apply Voucher          │  ├─ Product Management        │
│  ├─ Get Promotions         │  ├─ Order Management          │
│  └─ Calculate Discount     │  └─ Settings                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 3. Business Logic Layer
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│              Business Logic Services                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Order Management Service                   │   │
│  │ - Create order validate & calculate total            │   │
│  │ - Update order status & timeline                     │   │
│  │ - Cancel & refund orders                             │   │
│  │ - Inventory update                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Payment Processing Service                    │   │
│  │ - Validate payment method                            │   │
│  │ - Process transaction                                │   │
│  │ - Handle payment callbacks                           │   │
│  │ - Manage refunds                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       Shipping & Logistics Service                   │   │
│  │ - Calculate shipping fees                            │   │
│  │ - Integrate with shipping partners                   │   │
│  │ - Create shipments & track packages                  │   │
│  │ - Handle shipping callbacks                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Promotion & Discount Service                  │   │
│  │ - Calculate discount amounts                         │   │
│  │ - Apply voucher codes                                │   │
│  │ - Manage promotion schedules                         │   │
│  │ - Track promotion usage                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Notification Service                          │   │
│  │ - Send order notifications                           │   │
│  │ - Send promotion alerts                              │   │
│  │ - Real-time message delivery                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Search & Analytics Service                    │   │
│  │ - Product search & indexing                          │   │
│  │ - Generate seller analytics                          │   │
│  │ - Track user behavior                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 4. Data Access Layer (Database)
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  Database Layer                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐   ┌──────────────────────┐        │
│  │   User Management    │   │  Product Management  │        │
│  ├──────────────────────┤   ├──────────────────────┤        │
│  │ - users              │   │ - categories         │        │
│  │ - user_addresses     │   │ - products           │        │
│  │ - sellers            │   │ - product_images     │        │
│  │ - seller_bank_       │   │ - product_variants   │        │
│  │   accounts           │   │ - inventory_history  │        │
│  └──────────────────────┘   └──────────────────────┘        │
│                                                               │
│  ┌──────────────────────┐   ┌──────────────────────┐        │
│  │  Order Management    │   │  Payment Processing  │        │
│  ├──────────────────────┤   ├──────────────────────┤        │
│  │ - orders             │   │ - payment_methods    │        │
│  │ - order_items        │   │ - payment_           │        │
│  │ - order_timeline     │   │   transactions       │        │
│  └──────────────────────┘   │ - refunds            │        │
│                              └──────────────────────┘        │
│                                                               │
│  ┌──────────────────────┐   ┌──────────────────────┐        │
│  │  Shipping & Logistics│   │  Promotions & Reviews│        │
│  ├──────────────────────┤   ├──────────────────────┤        │
│  │ - shipping_methods   │   │ - promotions         │        │
│  │ - shipping_partners  │   │ - promotion_items    │        │
│  │ - shipments          │   │ - vouchers           │        │
│  │ - tracking_updates   │   │ - voucher_usages     │        │
│  │ - shipping_fees      │   │ - product_reviews    │        │
│  └──────────────────────┘   │ - seller_reviews     │        │
│                              └──────────────────────┘        │
│                                                               │
│  ┌──────────────────────┐   ┌──────────────────────┐        │
│  │  Communication       │   │  Audit & System      │        │
│  ├──────────────────────┤   ├──────────────────────┤        │
│  │ - conversations      │   │ - admin_logs         │        │
│  │ - messages           │   │ - notifications      │        │
│  │ - notifications      │   │                      │        │
│  └──────────────────────┘   └──────────────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 5. External Integrations
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│              Third-Party Integrations                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Payment Gateways              │  Shipping Partners         │
│  ├─ MoMo Wallet                 │  ├─ GHN (Giao Hàng Nhanh) │
│  ├─ ZaloPay                     │  ├─ Shopee Express        │
│  ├─ Bank Transfers              │  ├─ Ahamove              │
│  └─ COD (Cash on Delivery)      │  └─ J&T Express          │
│                                 │                          │
│  Communication                 │  Analytics & Monitoring  │
│  ├─ Email Service               │  ├─ Google Analytics     │
│  ├─ SMS Notifications           │  ├─ Firebase             │
│  └─ Push Notifications          │  └─ Application Logs     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Data Flow Diagrams

### Customer Order Flow
\`\`\`
Customer
    ↓
Browse Products
    ↓
Add to Cart
    ↓
Checkout
    ↓
Select Payment Method
    ↓
Process Payment (MoMo/ZaloPay/Bank/COD)
    ↓
Create Order
    ↓
Update Inventory
    ↓
Send Confirmation Notification
    ↓
Seller receives Order
    ↓
Seller packs & ships
    ↓
Create Shipment & Tracking
    ↓
Customer receives updates
    ↓
Customer receives package
    ↓
Customer can leave review
    ↓
Payment settled to Seller
\`\`\`

### Seller Shop Management Flow
\`\`\`
Seller logs in
    ↓
Dashboard → View analytics & KPIs
    ↓
Product Management
├─ Add/Edit/Delete products
├─ Manage inventory
└─ View product analytics
    ↓
Order Management
├─ View new orders
├─ Confirm & prepare shipment
├─ Update tracking
└─ Handle returns/refunds
    ↓
Customer Management
├─ View customer history
├─ Send promotions
└─ Track customer metrics
    ↓
Promotion Management
├─ Create flash sales
├─ Manage vouchers
└─ Track promotion ROI
    ↓
Communication
├─ Message with customers
├─ Send notifications
└─ Build customer relationships
\`\`\`

### Payment & Refund Flow
\`\`\`
Order Created (Pending Payment)
    ↓
Customer Selects Payment Method
    ↓
├─ COD → Seller ships → Customer pays on delivery
├─ Bank → Customer transfers → Verify payment → Confirm order
└─ MoMo/ZaloPay → Real-time payment gateway → Instant confirmation
    ↓
Order Confirmed (Paid)
    ↓
Seller prepares shipment
    ↓
[If customer requests refund]
    ↓
Refund Request Created (Pending Approval)
    ↓
Seller Reviews Return
    ↓
├─ Approved → Return Shipment → Verify goods → Process Refund
└─ Rejected → Refund Cancelled
    ↓
Payment Refunded to Customer
\`\`\`

### Shipping Tracking Flow
\`\`\`
Shipment Created
    ↓
Integrate with Shipping Partner API
    ↓
Generate Tracking Number
    ↓
↓
Send tracking info to customer
    ↓
↓ (Real-time updates from shipping partner)
Package Picked Up
    ↓
In Transit
    ↓
Out for Delivery
    ↓
Delivered / Failed
    ↓
Update Order Status
    ↓
Notify Customer
    ↓
Allow Review & Rating
\`\`\`

## System Architecture Diagram (ASCII)

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├──────────────────────────┬──────────────────────────────────────────┤
│  Customer Portal         │  Seller Dashboard                        │
│  - Browse Products       │  - Orders Management                     │
│  - Shopping Cart         │  - Analytics                             │
│  - Orders                │  - Product Management                    │
│  - Profile               │  - Customer Management                   │
│  - Help/Support          │  - Shipping Integration                  │
└──────────────────────────┴──────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP ROUTER                              │
├─────────────────────────────────────────────────────────────────────┤
│  Route Handlers & Server Actions                                    │
│  - 34 Routes (pages)                                                 │
│  - API Routes                                                        │
│  - Middleware & Authentication                                      │
│  - Image Optimization & Static Generation                           │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  - Request Validation                                               │
│  - Authentication & Authorization                                   │
│  - Rate Limiting                                                    │
│  - Request Routing                                                  │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC SERVICES                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Order      │  │   Payment    │  │   Shipping   │             │
│  │ Management   │  │  Processing  │  │ & Logistics  │             │
│  │   Service    │  │   Service    │  │   Service    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Promotion   │  │ Notification │  │   Search &   │             │
│  │  & Discount  │  │   Service    │  │  Analytics   │             │
│  │   Service    │  │              │  │   Service    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  - Query Builders                                                   │
│  - Database Connection Pooling                                      │
│  - Cache Layer (Redis)                                              │
│  - Transaction Management                                           │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌───────────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                                     │
├─────────────────────────────────────────────────────────────────────┐
│  PostgreSQL / MySQL Database                                        │
│  - 21 Tables                                                        │
│  - 200+ Columns                                                     │
│  - 40+ Indexes                                                      │
│  - Foreign Key Relationships                                        │
│  - Row Level Security (if using PostgreSQL)                         │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                 THIRD-PARTY INTEGRATIONS                             │
├─────────────────────────────────────────────────────────────────────┤
│  Payment Gateways          │  Shipping Partners                     │
│  - MoMo                    │  - GHN API                             │
│  - ZaloPay                 │  - Shopee Express                      │
│  - Bank Gateway            │  - Ahamove                             │
│  - COD Handler             │  - J&T                                 │
│                            │                                       │
│  Communication             │  Analytics                            │
│  - Email Service           │  - Google Analytics                   │
│  - SMS Gateway             │  - Application Monitoring             │
│  - Push Notifications      │  - Error Tracking (Sentry)            │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

## Key System Characteristics

### Scalability
- UUID for all primary keys (no sequential ID conflicts)
- Partitioning support for large tables (orders, transactions)
- Caching strategy for frequently accessed data
- Read replicas for analytics queries

### Security
- Row Level Security (RLS) for multi-tenant data
- Password hashing & secure authentication
- Payment PCI compliance
- API authentication tokens
- Admin action audit logs

### Performance
- Indexed queries on frequently filtered columns
- Pagination for large result sets
- Cache invalidation strategy
- Connection pooling
- Database query optimization

### Reliability
- Transaction management for order processing
- Idempotent payment processing
- Retry logic for shipping integration
- Backup & disaster recovery strategy
- Error logging & monitoring

## Technology Stack

**Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
**Backend**: Next.js API Routes, Server Actions
**Database**: PostgreSQL or MySQL
**Caching**: Redis
**Payment**: MoMo, ZaloPay, Bank Gateway
**Shipping**: GHN, Shopee Express, Ahamove, J&T
**Authentication**: JWT + Refresh tokens
**File Storage**: S3 or Vercel Blob
**Monitoring**: Sentry, CloudWatch
