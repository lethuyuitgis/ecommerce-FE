package com.shopcuathuy.admin.controller;

import com.shopcuathuy.admin.AdminService;
import com.shopcuathuy.admin.dto.AdminComplaintDTO;
import com.shopcuathuy.admin.dto.CreateComplaintRequest;
import com.shopcuathuy.admin.dto.UpdateComplaintStatusRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/complaints")
public class AdminComplaintController {

    private final AdminService adminService;

    public AdminComplaintController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<List<AdminComplaintDTO>> listComplaints(
            @RequestParam(required = false) String status
    ) {
        List<AdminComplaintDTO> complaints = adminService.listComplaints(status);
        adminService.recordRequest(true);
        return ResponseEntity.ok(complaints);
    }

    @PostMapping
    public ResponseEntity<AdminComplaintDTO> createComplaint(@RequestBody CreateComplaintRequest request) {
        AdminComplaintDTO created = adminService.createComplaint(request);
        adminService.recordRequest(true);
        return ResponseEntity.status(201).body(created);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminComplaintDTO> updateStatus(@PathVariable String id,
                                                          @RequestBody UpdateComplaintStatusRequest request) {
        return adminService.updateComplaintStatus(id, request.getStatus())
                .map(complaint -> {
                    adminService.recordRequest(true);
                    return ResponseEntity.ok(complaint);
                })
                .orElseGet(() -> {
                    adminService.recordRequest(false);
                    return ResponseEntity.notFound().build();
                });
    }
}


