package com.shopcuathuy.admin.controller;

import com.shopcuathuy.admin.AdminService;
import com.shopcuathuy.admin.dto.SellerAnalyticsDashboardDTO;
import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller/analytics")
public class SellerAnalyticsController {

    private final AdminService adminService;

    public SellerAnalyticsController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<SellerAnalyticsDashboardDTO>> getDashboard(
            @RequestParam(required = false, defaultValue = "30days") String period
    ) {
        SellerAnalyticsDashboardDTO dashboard = adminService.getAnalyticsDashboard(period);
        adminService.recordRequest(true);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }
}


