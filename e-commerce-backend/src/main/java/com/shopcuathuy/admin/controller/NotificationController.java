package com.shopcuathuy.admin.controller;

import com.shopcuathuy.admin.AdminService;
import com.shopcuathuy.admin.dto.NotificationDTO;
import com.shopcuathuy.admin.dto.PageResponse;
import com.shopcuathuy.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final AdminService adminService;

    public NotificationController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<NotificationDTO>>> listNotifications(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageResponse<NotificationDTO> data = adminService.listNotifications(userId, page, size);
        adminService.recordRequest(true);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@RequestParam String userId) {
        long count = adminService.getUnreadCount(userId);
        adminService.recordRequest(true);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDTO>> markAsRead(@PathVariable String id,
                                                                   @RequestParam String userId) {
        return adminService.markNotificationAsRead(userId, id)
                .map(dto -> {
                    adminService.recordRequest(true);
                    return ResponseEntity.ok(ApiResponse.success("Notification marked as read", dto));
                })
                .orElseGet(() -> {
                    adminService.recordRequest(false);
                    return ResponseEntity.status(404).body(ApiResponse.error("Notification not found"));
                });
    }

    @PostMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@RequestParam String userId) {
        adminService.markAllNotificationsAsRead(userId);
        adminService.recordRequest(true);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable String id,
                                                                @RequestParam String userId) {
        boolean deleted = adminService.deleteNotification(userId, id);
        adminService.recordRequest(deleted);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
        }
        return ResponseEntity.status(404).body(ApiResponse.error("Notification not found"));
    }
}


