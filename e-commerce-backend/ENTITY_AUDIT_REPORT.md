# Entity Audit Report - Backend

## Tổng quan

**Ngày kiểm tra:** 2025-11-14  
**Trạng thái:** ✅ Không có entity nào chưa được sử dụng

## Kết quả kiểm tra

### 1. Thư mục Entity
- **Đường dẫn:** `src/main/java/com/shopcuathuy/entity/`
- **Trạng thái:** 📁 Thư mục trống
- **Số lượng file:** 0

### 2. Thư mục Repository
- **Đường dẫn:** `src/main/java/com/shopcuathuy/repository/`
- **Trạng thái:** 📁 Thư mục trống
- **Số lượng file:** 0

### 3. JPA Dependencies
- **spring-boot-starter-data-jpa:** ❌ Không có trong `pom.xml`
- **Database driver:** ❌ Không có
- **Hibernate:** ❌ Không có

### 4. Data Storage Hiện tại

Backend đang sử dụng **In-Memory Data Store** thay vì JPA Entities:

- **Class:** `AdminDataStore.java`
- **Cơ chế:** `ConcurrentHashMap` để lưu trữ dữ liệu
- **Dữ liệu:** Tất cả dữ liệu được lưu trong memory, mất khi restart

#### Các Map đang được sử dụng:
1. `Map<String, AdminUserDTO> users`
2. `Map<String, AdminSellerDTO> sellers`
3. `Map<String, AdminShipmentDTO> shipments`
4. `Map<String, AdminVoucherDTO> vouchers`
5. `Map<String, AdminPromotionDTO> promotions`
6. `Map<String, AdminComplaintDTO> complaints`
7. `Map<String, List<NotificationDTO>> notifications`

### 5. DTO Classes (Thay vì Entities)

Backend sử dụng DTO pattern thay vì JPA Entities:

**Location:** `src/main/java/com/shopcuathuy/admin/dto/`

Các DTO đang được sử dụng:
- `AdminUserDTO`
- `AdminSellerDTO`
- `AdminShipmentDTO`
- `AdminVoucherDTO`
- `AdminPromotionDTO`
- `AdminComplaintDTO`
- `NotificationDTO`
- `SellerAnalyticsDashboardDTO`
- `SellerOverviewDTO`
- Và nhiều DTO khác...

## Kết luận

### ✅ Không có entity nào chưa được sử dụng
- Thư mục `entity/` trống hoàn toàn
- Không có JPA entities được định nghĩa
- Backend không sử dụng database persistence layer

### 📋 Khuyến nghị

Nếu muốn chuyển sang sử dụng database thật:

1. **Thêm JPA Dependencies vào `pom.xml`:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
<!-- hoặc PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
```

2. **Tạo JPA Entities:**
   - Chuyển đổi các DTO thành JPA Entities
   - Thêm annotations: `@Entity`, `@Table`, `@Id`, `@Column`, etc.
   - Định nghĩa relationships: `@OneToMany`, `@ManyToOne`, etc.

3. **Tạo Repositories:**
   - Tạo interface extends `JpaRepository<Entity, ID>`
   - Thêm custom query methods nếu cần

4. **Cấu hình Database:**
   - Thêm `application.properties` hoặc `application.yml`
   - Cấu hình datasource, JPA properties

5. **Migration từ In-Memory:**
   - Thay thế `AdminDataStore` bằng Repository calls
   - Tạo migration scripts nếu cần

## Files liên quan

- `src/main/java/com/shopcuathuy/admin/AdminDataStore.java` - In-memory data store
- `src/main/java/com/shopcuathuy/admin/AdminService.java` - Service layer sử dụng AdminDataStore
- `pom.xml` - Maven dependencies (thiếu JPA)

