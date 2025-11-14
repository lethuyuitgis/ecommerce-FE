package com.shopcuathuy.controller;

import com.shopcuathuy.service.SellerReportService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/seller/reports")
public class SellerReportController {

    private final SellerReportService reportService;

    public SellerReportController(SellerReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/export")
    public ResponseEntity<Resource> exportReport(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false, defaultValue = "EXCEL") String type,
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "all") String reportType
    ) {
        try {
            // Parse dates if provided
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;

            // Calculate dates based on period if not provided
            if (start == null || end == null) {
                LocalDate[] dateRange = calculateDateRange(period);
                start = dateRange[0];
                end = dateRange[1];
            }

            Resource file = reportService.exportReport(userId, type, start, end, reportType);

            String contentType = type.equalsIgnoreCase("PDF") 
                ? MediaType.APPLICATION_PDF_VALUE 
                : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            
            String extension = type.equalsIgnoreCase("PDF") ? "pdf" : "xlsx";
            String filename = String.format("bao-cao-%s-%s.%s", 
                period != null ? period : "custom",
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                extension);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(file);
        } catch (Exception e) {
            throw new RuntimeException("Failed to export report: " + e.getMessage(), e);
        }
    }

    private LocalDate[] calculateDateRange(String period) {
        LocalDate end = LocalDate.now();
        LocalDate start;

        if (period == null || period.equals("30days")) {
            start = end.minusDays(30);
        } else if (period.equals("7days")) {
            start = end.minusDays(7);
        } else if (period.equals("90days")) {
            start = end.minusDays(90);
        } else if (period.equals("year")) {
            start = end.withDayOfYear(1);
        } else {
            // Default to 30 days
            start = end.minusDays(30);
        }

        return new LocalDate[]{start, end};
    }
}


