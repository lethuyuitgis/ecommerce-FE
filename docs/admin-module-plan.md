# Admin Module – System Management & Shipping Creation

This document captures the scope and implementation steps for the new admin
features that were requested:

> “thêm chức năng của admin quản trị hệ thống, quản lý user, seller thì có thêm
> chức tăng tạo vận đơn cho để ship vào nhận”

Translated summary:
* Admin dashboard must allow system management tasks.
* Admin can manage users (create/update/ban/reactivate, role assignment).
* Admin can manage sellers.
* Admin can create shipping manifests so shippers can accept pickup jobs.

---

## 1. Current State

### Frontend
* `app/admin/page.tsx` is only a placeholder.
* There is no UI under `/admin` for users, sellers, or shipments.

### Backend
* Repository contains only review & report code.  
  Entities, controllers, services for `User`, `Seller`, `Order`, or `Shipment`
  are **absent**.  
* Therefore REST APIs required for admin operations do not exist in the
  available source tree.

Due to missing backend domains we cannot implement the feature end‑to‑end
inside this repository. The plan below describes what must be created /
integrated once the backend modules are present.

---

## 2. Functional Requirements

### 2.1 Admin Authentication & Authorization
* Admin must log in with an account whose `user_type = ADMIN`.
* Admin routes (`/admin/**`) require ADMIN role; redirect non‑admins.
* Admin JWT should include role so FE can gate UI.

### 2.2 User Management
* List/search/filter users (customer, seller, shipper, admin).
* View user profile summary (name, email, status, role, createdAt, lastLogin).
* Actions:
  * Activate / deactivate account.
  * Promote / demote roles (e.g., upgrade user to seller, assign shipper).
  * Reset password (optional email flow).

### 2.3 Seller Management
* Approve seller registrations.
* View seller store info: shop name, documents, stats.
* Suspend / reinstate seller.
* Link to seller dashboards.

### 2.4 Shipping Manifest Creation
* Admin can create shipping orders (“vận đơn”) for customer orders.
* Data needed:
  * Order id
  * Pickup address (seller)
  * Delivery address (customer)
  * Package details (weight, size, COD amount)
  * Preferred shipper / auto‑assign
* Shipper queue:
  * New manifest enters “Awaiting pickup”.
  * Shipper dashboard should show available manifests to claim.

---

## 3. API Design (to be implemented once backend domain exists)

All routes under `/api/admin/**` (require ADMIN role).

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | /admin/users | Paginated list, accepts `role`, `status`, `keyword`. |
| GET | /admin/users/{id} | User detail summary. |
| PATCH | /admin/users/{id}/status | Body `{status: ACTIVE|SUSPENDED}`. |
| PATCH | /admin/users/{id}/role | Body `{role: CUSTOMER|SELLER|SHIPPER|ADMIN}`. |
| GET | /admin/sellers | Paginated list + filters (`status`, `keyword`). |
| PATCH | /admin/sellers/{id}/status | Approve/suspend. |
| GET | /admin/sellers/{id} | Seller detail (shop info, stats). |
| POST | /admin/shipments | Create shipment from order. |
| GET | /admin/shipments | Paginated shipments (filter by status, shipper). |
| PATCH | /admin/shipments/{id}/assign | Assign to shipper. |
| PATCH | /admin/shipments/{id}/status | Update status (e.g., “READY_FOR_PICKUP”). |

Supporting domain objects required:
* `User`, `SellerProfile`, `Order`, `Shipment`.
* Repositories + services for each.
* Event for notifying shipper when a manifest is created or assigned.

---

## 4. Frontend Implementation Plan

1. **Route Guard**
   * Extend `AuthContext` to expose `user.userType`.
   * Create `components/admin/require-admin.tsx` to protect admin pages.

2. **Admin Layout**
   * Sidebar with sections: Dashboard, Users, Sellers, Shipments, Settings.
   * Top summary cards (total users, sellers, pending approvals, shipments).

3. **Users Tab**
   * Table with sorting/filter/search.
   * `ActionDropdown` per user for status/role changes.
   * Modal for viewing profile detail.

4. **Sellers Tab**
   * Similar table plus approval flow.
   * Buttons for `Approve`, `Suspend`, `View store`.

5. **Shipments Tab**
   * “Create Shipment” button -> modal form.
   * Show list with status badges, assigned shipper, last update.
   * Bulk actions (assign to shipper, cancel).

6. **API Hooks**
   * `lib/api/admin.ts` for the endpoints above.
   * `hooks/useAdminUsers`, `useAdminSellers`, `useAdminShipments`.

7. **Shipper Dashboard Integration**
   * Update `/ship` pages to query new shipments endpoint (`/shipments/available`).
   * Provide action to “Claim shipment”.

---

## 5. Backend Tasks Checklist

1. Add domain entities (`User`, `Seller`, `Order`, `Shipment`) with required fields.
2. Add repositories with pagination methods.
3. Implement services for business logic (status transitions, assignment).
4. Implement admin REST controllers under `/api/admin/**`.
5. Add security configuration to enforce ADMIN role.
6. Create DB migrations (Flyway/Liquibase) for new tables & indexes.

---

## 6. Frontend Tasks Checklist

1. Protect admin routes.
2. Create Admin layout & navigation.
3. Implement Users management UI + modals.
4. Implement Sellers management UI.
5. Implement Shipments management UI + creation form.
6. Update shipper dashboard to consume shipments.
7. Add toast notifications, loading states, error handling.

---

## 7. Outstanding Dependencies / Blockers

* The repository currently lacks the backend models needed for users/sellers/shipments. Implementation must either:
  * Pull the full backend module from its original source, or
  * Develop new backend code following the plan above.
* Authentication/authorization wiring must expose ADMIN role in JWT so frontend can check it.

Once these prerequisites are in place, we can proceed with the concrete code changes described in the plan.

