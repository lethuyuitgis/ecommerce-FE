package com.shopcuathuy.admin.controller;

import com.shopcuathuy.admin.AdminService;
import com.shopcuathuy.admin.dto.SellerOverviewDTO;
import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller/overview")
public class SellerOverviewController {

    private final AdminService adminService;

    public SellerOverviewController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SellerOverviewDTO>> getOverview(@RequestParam(required = false) String sellerId) {
        SellerOverviewDTO overview = adminService.getSellerOverview(sellerId);
        adminService.recordRequest(true);
        return ResponseEntity.ok(ApiResponse.success(overview));
    }
}


