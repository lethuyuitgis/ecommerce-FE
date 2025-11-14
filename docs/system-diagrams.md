# System Diagrams (Conceptual)

> The diagrams below are generated with Mermaid syntax so they can be previewed
> in compatible editors. They reflect the planned admin, seller, shipper, and
> customer interactions with the platform.

## 1. Use Case Diagram

```mermaid
graph TD
  Admin(Admin):::actor
  Seller(Seller):::actor
  Shipper(Shipper):::actor
  Customer(Customer):::actor

  subgraph System
    UC1[Manage Users]
    UC2[Manage Sellers]
    UC3[Create Shipping Manifest]
    UC4[Process Orders]
    UC5[Manage Products]
    UC6[Fulfil Shipment]
    UC7[Browse & Purchase]
    UC8[Leave Review]
    UC9[Chat & Notifications]
  end

  Admin --> UC1
  Admin --> UC2
  Admin --> UC3
  Admin --> UC9
  Seller --> UC2
  Seller --> UC5
  Seller --> UC4
  Seller --> UC9
  Shipper --> UC6
  Shipper --> UC9
  Customer --> UC7
  Customer --> UC4
  Customer --> UC8
  Customer --> UC9

  classDef actor fill:#fef3c7,stroke:#d97706,stroke-width:1px;
```

## 2. Activity Diagram – Admin Creates Shipping Manifest

```mermaid
flowchart TD
  Start([Start]) --> A[Admin selects pending order]
  A --> B{Order already has shipment?}
  B -- Yes --> End1([Abort: already created])
  B -- No --> C[Fill shipment form<br/>(pickup, delivery, weight, COD)]
  C --> D[Assign shipper (optional)]
  D --> E[Submit manifest]
  E --> F[Persist shipment + event READY_FOR_PICKUP]
  F --> G[Notify shipper(s)]
  G --> End([Done])
```

## 3. Sequence Diagram – Shipper Claims Shipment

```mermaid
sequenceDiagram
  participant Admin
  participant API as Backend API
  participant Shipper
  participant DB as Database

  Admin->>API: POST /admin/shipments {orderId,...}
  API->>DB: Insert shipment, event
  DB-->>API: OK
  API-->>Admin: 201 Created

  Shipper->>API: GET /shipments/available
  API->>DB: Query shipments status=READY_FOR_PICKUP
  DB-->>API: List
  API-->>Shipper: 200 OK

  Shipper->>API: PATCH /shipments/{id}/claim
  API->>DB: Update shipment (assign shipper, status=PICKED_UP)
  DB-->>API: OK
  API-->>Shipper: 200 OK (manifest details)
```

## 4. DFD Level 0 (Context)

```mermaid
graph TD
  Customer((Customer))
  Seller((Seller))
  Shipper((Shipper))
  Admin((Admin))
  System[<b>E-Commerce Platform</b>]

  Customer -->|Browse/Buy| System
  System -->|Order status, notifications| Customer
  Seller -->|Product & Order data| System
  System -->|Sales reports, messages| Seller
  Shipper -->|Pickup/Delivery updates| System
  System -->|Manifests, notifications| Shipper
  Admin -->|Management commands| System
  System -->|Dashboards, audit logs| Admin
```

## 5. DFD Level 1 – Order & Shipment Processes

```mermaid
graph TD
  subgraph P1[Process P1: Order Management]
    C1((Customer)) -->|Place Order| P1a[Validate & Create Order]
    P1a --> P1b[Reserve Inventory]
    P1b -->|Order| D1[(Orders DB)]
    D1 -->|Order Events| P1c[Notify Seller]
    P1c --> S1((Seller))
  end

  subgraph P2[Process P2: Shipping Management]
    Admin1((Admin)) -->|Create Manifest| P2a[Create Shipment]
    P2a --> D2[(Shipments DB)]
    D2 --> P2b[Alert Shippers]
    P2b --> Ship1((Shipper))
    Ship1 -->|Pickup/Update| P2c[Update Shipment Status]
    P2c --> D2
    P2c -->|Delivery Status| P1d[Close Order]
    P1d --> D1
  end

  D1 -->|Payment Info| P3[Process Payments]
  P3 --> D3[(Payments DB)]
```

## 6. Class Diagram (High-Level)

```mermaid
classDiagram
  class User {
    +UUID id
    +String email
    +String fullName
    +UserType userType
    +AccountStatus status
    +Date createdAt
  }

  class SellerProfile {
    +UUID id
    +UUID userId
    +String shopName
    +SellerStatus status
  }

  class Product {
    +UUID id
    +UUID sellerId
    +UUID categoryId
    +String name
    +Decimal price
  }

  class ProductVariant {
    +UUID id
    +UUID productId
    +String sku
    +JSON optionValues
    +int quantity
  }

  class Order {
    +UUID id
    +UUID customerId
    +UUID sellerId
    +OrderStatus status
    +Decimal totalAmount
  }

  class OrderItem {
    +UUID id
    +UUID orderId
    +UUID productId
    +UUID variantId
    +int quantity
    +Decimal price
  }

  class Shipment {
    +UUID id
    +UUID orderId
    +UUID shipperId
    +ShipmentStatus status
  }

  class ShipmentEvent {
    +long id
    +UUID shipmentId
    +String status
    +Date eventTime
  }

  class Review {
    +UUID id
    +UUID productId
    +UUID customerId
    +int rating
  }

  User "1" o-- "1" SellerProfile : owns >
  SellerProfile "1" o-- "many" Product : offers >
  Product "1" o-- "many" ProductVariant : has >
  User "1" o-- "many" Order : places >
  Order "1" o-- "many" OrderItem : includes >
  Order "1" o-- "1" Shipment : fulfills >
  Shipment "1" o-- "many" ShipmentEvent : updates >
  Product "1" o-- "many" Review : receives >
```

## 7. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
  USERS ||--o{ USER_ROLES : "has"
  USERS ||--|| SELLER_PROFILES : "owns store"
  USERS ||--o{ ORDERS : "places"
  USERS ||--o{ NOTIFICATIONS : "receives"
  USERS ||--o{ MESSAGES : "sends"
  USERS ||--o{ SHIPMENTS : "delivers (shipper)" 

  SELLER_PROFILES ||--o{ PRODUCTS : "lists"
  SELLER_PROFILES ||--o{ SHIPMENTS : "originates"
  SELLER_PROFILES ||--o{ SELLER_DOCUMENTS : "uploads"
  SELLER_PROFILES ||--|| SELLER_SETTINGS : "has"

  CATEGORIES ||--o{ PRODUCTS : "categorizes"
  PRODUCTS ||--o{ PRODUCT_VARIANTS : "has variants"
  PRODUCTS ||--o{ PRODUCT_IMAGES : "has images"
  PRODUCTS ||--o{ ORDER_ITEMS : "ordered in"
  PRODUCTS ||--o{ REVIEWS : "reviewed"

  ORDERS ||--o{ ORDER_ITEMS : "contains"
  ORDERS ||--|| PAYMENTS : "paid_by"
  ORDERS ||--o{ SHIPMENTS : "fulfilled_by"
  ORDERS ||--o{ ORDER_VOUCHERS : "applies"

  SHIPMENTS ||--o{ SHIPMENT_EVENTS : "tracked by"

  CONVERSATIONS ||--o{ MESSAGES : "consists of"
  USERS ||--o{ CONVERSATIONS : "participates"
  VOUCHERS ||--o{ ORDER_VOUCHERS : "applied"
```

These diagrams are conceptual and align with the schema in `docs/database-schema.sql`. 
They can be refined further once the detailed business rules and backend implementations
are finalized.

