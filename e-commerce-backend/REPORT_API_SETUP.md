# Hướng dẫn tích hợp API xuất báo cáo

## 1. Thêm dependency vào pom.xml

Thêm dependency Apache POI vào `pom.xml`:

```xml
<!-- Apache POI for Excel export -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.5</version>
</dependency>
```

## 2. Thêm methods vào Repository

### OrderRepository.java
Thêm method sau:

```java
List<Order> findBySellerIdAndCreatedAtBetween(String sellerId, LocalDateTime start, LocalDateTime end);
```

### ProductRepository.java
Đảm bảo có method:

```java
List<Product> findBySellerId(String sellerId);
```

### SellerRepository.java
Đảm bảo có method:

```java
Optional<Seller> findByUserId(String userId);
```

## 3. Files đã tạo

- `SellerReportController.java` - Controller xử lý request xuất báo cáo
- `SellerReportService.java` - Service tạo file Excel/PDF
- `SellerReportDTO.java` - DTO chứa dữ liệu báo cáo

## 4. API Endpoint

**POST** `/api/seller/reports/export`

**Headers:**
- `X-User-Id`: ID của seller

**Query Parameters:**
- `type` (optional, default: "EXCEL"): "EXCEL" hoặc "PDF"
- `period` (optional): "7days", "30days", "90days", "year"
- `startDate` (optional): Format "yyyy-MM-dd"
- `endDate` (optional): Format "yyyy-MM-dd"
- `reportType` (optional, default: "all"): "revenue", "orders", "products", "customers", "all"

**Response:**
- File Excel (.xlsx) hoặc PDF (.pdf)
- Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet hoặc application/pdf
- Content-Disposition: attachment; filename="bao-cao-{period}-{date}.{ext}"

## 5. Ví dụ sử dụng

```bash
curl -X POST "http://localhost:8080/api/seller/reports/export?type=EXCEL&period=30days" \
  -H "X-User-Id: {sellerUserId}" \
  --output report.xlsx
```

## 6. Lưu ý

- PDF export hiện tại trả về Excel file (có thể cải thiện sau với iText hoặc Apache PDFBox)
- Đảm bảo các entity Order, Product, Seller có các relationships đúng
- Cần kiểm tra các enum Status của Order và Product


