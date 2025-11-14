package com.shopcuathuy.admin;

import com.shopcuathuy.admin.dto.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminDataStore store;

    public AdminService(AdminDataStore store) {
        this.store = store;
    }

    public List<AdminUserDTO> listUsers(String q, String role, String status) {
        return store.listUsers(q, role, status);
    }

    public AdminUserDTO createUser(CreateUserRequest request) {
        return store.createUser(request);
    }

    public Optional<AdminUserDTO> updateUserStatus(String id, String status) {
        return store.updateUserStatus(id, status);
    }

    public Optional<AdminUserDTO> updateUserRole(String id, String role) {
        return store.updateUserRole(id, role);
    }

    public boolean deleteUser(String id) {
        return store.deleteUser(id);
    }

    public List<AdminSellerDTO> listSellers(String q, String status) {
        return store.listSellers(q, status);
    }

    public Optional<AdminSellerDTO> updateSellerStatus(String id, String status) {
        return store.updateSellerStatus(id, status);
    }

    public AdminShipmentDTO createShipment(CreateShipmentRequest request) {
        return store.createShipment(request);
    }

    public List<AdminShipmentDTO> listShipments(String status) {
        return store.listShipments(status);
    }

    public Optional<AdminShipmentDTO> assignShipment(String id, String shipperId) {
        return store.assignShipment(id, shipperId);
    }

    public Optional<AdminShipmentDTO> updateShipmentStatus(String id, String status) {
        return store.updateShipmentStatus(id, status);
    }

    public List<AdminShipmentDTO> listAvailableShipments() {
        return store.listShipments("READY_FOR_PICKUP");
    }

    public List<AdminVoucherDTO> listVouchers(String q, String status, String type) {
        return store.listVouchers(q, status, type);
    }

    public AdminVoucherDTO createVoucher(CreateVoucherRequest request) {
        return store.createVoucher(request);
    }

    public Optional<AdminVoucherDTO> updateVoucher(String id, UpdateVoucherRequest request) {
        return store.updateVoucher(id, request);
    }

    public boolean deleteVoucher(String id) {
        return store.deleteVoucher(id);
    }

    public PageResponse<AdminPromotionDTO> listPromotions(String sellerId, int page, int size) {
        return store.listPromotions(sellerId, page, size);
    }

    public AdminPromotionDTO createPromotion(String sellerId, CreatePromotionRequest request) {
        return store.createPromotion(sellerId, request);
    }

    public List<AdminComplaintDTO> listComplaints(String status) {
        return store.listComplaints(status);
    }

    public AdminComplaintDTO createComplaint(CreateComplaintRequest request) {
        return store.createComplaint(request);
    }

    public Optional<AdminComplaintDTO> updateComplaintStatus(String id, String status) {
        return store.updateComplaintStatus(id, status);
    }

    public AdminSystemMetricsDTO getMetrics() {
        return store.getMetrics();
    }

    public void recordRequest(boolean success) {
        store.recordRequest(success);
    }

    public SellerOverviewDTO getSellerOverview(String sellerId) {
        return store.getSellerOverview(sellerId);
    }

    public PageResponse<NotificationDTO> listNotifications(String userId, int page, int size) {
        return store.listNotifications(userId, page, size);
    }

    public long getUnreadCount(String userId) {
        return store.getUnreadCount(userId);
    }

    public Optional<NotificationDTO> markNotificationAsRead(String userId, String notificationId) {
        return store.markAsRead(userId, notificationId);
    }

    public void markAllNotificationsAsRead(String userId) {
        store.markAllAsRead(userId);
    }

    public boolean deleteNotification(String userId, String notificationId) {
        return store.deleteNotification(userId, notificationId);
    }

    public SellerAnalyticsDashboardDTO getAnalyticsDashboard(String period) {
        return store.getAnalyticsDashboard(period);
    }
}

