package com.shopcuathuy.service;

import com.shopcuathuy.dto.SellerReportDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SellerReportService {

    private static final Logger log = LoggerFactory.getLogger(SellerReportService.class);

    public Resource exportReport(String userId, String type, LocalDate startDate, LocalDate endDate, String reportType) {
        try {
            SellerReportDTO reportData = generateReportData(startDate, endDate);

            if ("PDF".equalsIgnoreCase(type)) {
                return generatePDFReport(reportData);
            }
            return generateExcelReport(reportData);
        } catch (Exception e) {
            log.error("Error generating report", e);
            throw new RuntimeException("Failed to generate report: " + e.getMessage(), e);
        }
    }

    private SellerReportDTO generateReportData(LocalDate startDate, LocalDate endDate) {
        SellerReportDTO report = new SellerReportDTO();

        LocalDate effectiveStart = startDate != null ? startDate : LocalDate.now().minusDays(30);
        LocalDate effectiveEnd = endDate != null ? endDate : LocalDate.now();

        List<SellerReportDTO.OrderSummary> orders = List.of(
                createOrder("ORD-1001", "Nguyễn Văn A", "COMPLETED", 2_450_000d, effectiveStart.atStartOfDay().plusHours(9)),
                createOrder("ORD-1002", "Trần Thị B", "DELIVERED", 1_820_000d, effectiveStart.plusDays(3).atStartOfDay().plusHours(11)),
                createOrder("ORD-1003", "Lê Văn C", "PENDING", 950_000d, effectiveEnd.minusDays(4).atStartOfDay().plusHours(14))
        );

        List<SellerReportDTO.ProductSummary> products = List.of(
                createProduct("Áo khoác dù", 450_000d, 120, "ACTIVE", "Thời trang nam"),
                createProduct("Giày thể thao nữ", 780_000d, 80, "ACTIVE", "Thời trang nữ"),
                createProduct("Túi xách da bò", 1_250_000d, 15, "OUT_OF_STOCK", "Phụ kiện"),
                createProduct("Thắt lưng da", 320_000d, 40, "ACTIVE", "Phụ kiện")
        );

        double totalRevenue = orders.stream()
                .filter(order -> "COMPLETED".equals(order.getStatus()) || "DELIVERED".equals(order.getStatus()))
                .mapToDouble(SellerReportDTO.OrderSummary::getFinalTotal)
                .sum();

        long completedOrders = orders.stream()
                .filter(order -> "COMPLETED".equals(order.getStatus()) || "DELIVERED".equals(order.getStatus()))
                .count();

        long activeProducts = products.stream()
                .filter(product -> "ACTIVE".equals(product.getStatus()))
                .count();

        report.setTotalRevenue(totalRevenue);
        report.setTotalOrders(orders.size());
        report.setCompletedOrders(completedOrders);
        report.setTotalProducts(products.size());
        report.setActiveProducts((int) activeProducts);
        report.setOrders(orders);
        report.setProducts(products);
        report.setStartDate(effectiveStart);
        report.setEndDate(effectiveEnd);

        return report;
    }

    private SellerReportDTO.OrderSummary createOrder(String number, String customer, String status, double total, LocalDateTime createdAt) {
        SellerReportDTO.OrderSummary summary = new SellerReportDTO.OrderSummary();
        summary.setOrderNumber(number);
        summary.setCustomerName(customer);
        summary.setStatus(status);
        summary.setFinalTotal(total);
        summary.setCreatedAt(createdAt);
        return summary;
    }

    private SellerReportDTO.ProductSummary createProduct(String name, double price, int quantity, String status, String category) {
        SellerReportDTO.ProductSummary summary = new SellerReportDTO.ProductSummary();
        summary.setName(name);
        summary.setPrice(price);
        summary.setQuantity(quantity);
        summary.setStatus(status);
        summary.setCategory(category);
        return summary;
    }

    private Resource generateExcelReport(SellerReportDTO report) throws IOException {
        Workbook workbook = new XSSFWorkbook();

        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setFontHeightInPoints((short) 12);
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);

        CellStyle titleStyle = workbook.createCellStyle();
        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);
        titleStyle.setFont(titleFont);

        Sheet overviewSheet = workbook.createSheet("Tổng quan");
        int rowNum = 0;

        Row titleRow = overviewSheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("BÁO CÁO TỔNG QUAN");
        titleCell.setCellStyle(titleStyle);

        rowNum++;
        createRow(overviewSheet, rowNum++, "Kỳ báo cáo",
                report.getStartDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) +
                        " - " + report.getEndDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        rowNum++;

        Row headerRow = overviewSheet.createRow(rowNum++);
        String[] headers = {"Chỉ số", "Giá trị"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        createRow(overviewSheet, rowNum++, "Doanh thu", String.format("%.0f ₫", report.getTotalRevenue()));
        createRow(overviewSheet, rowNum++, "Tổng đơn hàng", String.valueOf(report.getTotalOrders()));
        createRow(overviewSheet, rowNum++, "Đơn hàng hoàn thành", String.valueOf(report.getCompletedOrders()));
        createRow(overviewSheet, rowNum++, "Tổng sản phẩm", String.valueOf(report.getTotalProducts()));
        createRow(overviewSheet, rowNum++, "Sản phẩm đang bán", String.valueOf(report.getActiveProducts()));

        for (int i = 0; i < headers.length; i++) {
            overviewSheet.autoSizeColumn(i);
        }

        if (report.getOrders() != null && !report.getOrders().isEmpty()) {
            Sheet ordersSheet = workbook.createSheet("Đơn hàng");
            rowNum = 0;

            Row ordersHeaderRow = ordersSheet.createRow(rowNum++);
            String[] orderHeaders = {"Mã đơn", "Khách hàng", "Trạng thái", "Tổng tiền", "Ngày tạo"};
            for (int i = 0; i < orderHeaders.length; i++) {
                Cell cell = ordersHeaderRow.createCell(i);
                cell.setCellValue(orderHeaders[i]);
                cell.setCellStyle(headerStyle);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            for (SellerReportDTO.OrderSummary order : report.getOrders()) {
                Row row = ordersSheet.createRow(rowNum++);
                row.createCell(0).setCellValue(order.getOrderNumber());
                row.createCell(1).setCellValue(order.getCustomerName());
                row.createCell(2).setCellValue(order.getStatus());
                row.createCell(3).setCellValue(order.getFinalTotal());
                row.createCell(4).setCellValue(order.getCreatedAt().format(formatter));
            }

            for (int i = 0; i < orderHeaders.length; i++) {
                ordersSheet.autoSizeColumn(i);
            }
        }

        if (report.getProducts() != null && !report.getProducts().isEmpty()) {
            Sheet productsSheet = workbook.createSheet("Sản phẩm");
            rowNum = 0;

            Row productsHeaderRow = productsSheet.createRow(rowNum++);
            String[] productHeaders = {"Tên sản phẩm", "Giá", "Số lượng", "Trạng thái", "Danh mục"};
            for (int i = 0; i < productHeaders.length; i++) {
                Cell cell = productsHeaderRow.createCell(i);
                cell.setCellValue(productHeaders[i]);
                cell.setCellStyle(headerStyle);
            }

            for (SellerReportDTO.ProductSummary product : report.getProducts()) {
                Row row = productsSheet.createRow(rowNum++);
                row.createCell(0).setCellValue(product.getName());
                row.createCell(1).setCellValue(product.getPrice());
                row.createCell(2).setCellValue(product.getQuantity());
                row.createCell(3).setCellValue(product.getStatus());
                row.createCell(4).setCellValue(product.getCategory());
            }

            for (int i = 0; i < productHeaders.length; i++) {
                productsSheet.autoSizeColumn(i);
            }
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return new ByteArrayResource(outputStream.toByteArray());
    }

    private Resource generatePDFReport(SellerReportDTO report) {
        try {
            return generateExcelReport(report);
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }

    private void createRow(Sheet sheet, int rowNum, String label, String value) {
        Row row = sheet.createRow(rowNum);
        row.createCell(0).setCellValue(label);
        row.createCell(1).setCellValue(value);
    }
}

