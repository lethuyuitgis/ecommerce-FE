package com.shopcuathuy.admin;

import com.shopcuathuy.admin.dto.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Component
public class AdminDataStore {
    private final Map<String, AdminUserDTO> users = new ConcurrentHashMap<>();
    private final Map<String, AdminSellerDTO> sellers = new ConcurrentHashMap<>();
    private final Map<String, AdminShipmentDTO> shipments = new ConcurrentHashMap<>();
    private final Map<String, AdminVoucherDTO> vouchers = new ConcurrentHashMap<>();
    private final Map<String, AdminPromotionDTO> promotions = new ConcurrentHashMap<>();
    private final Map<String, AdminComplaintDTO> complaints = new ConcurrentHashMap<>();
    private final Map<String, List<NotificationDTO>> notifications = new ConcurrentHashMap<>();
    private final AdminSystemMetricsDTO metrics =
            new AdminSystemMetricsDTO(Instant.now(), 0, 0, 120);
    private long totalProducts = 120;
    private long totalOrders = 456;
    private long totalCustomers = 234;
    private double totalRevenue = 98_765_432.0;
    private final List<RevenuePointDTO> revenueSeries = new ArrayList<>();
    private final List<CategoryRevenueDTO> categorySeries = new ArrayList<>();
    private final List<CustomerTypeDTO> customerTypes = new ArrayList<>();
    private final List<CustomerLocationDTO> customerLocations = new ArrayList<>();
    private final List<TrafficPointDTO> trafficSeries = new ArrayList<>();
    private final List<TrafficSourceDTO> trafficSources = new ArrayList<>();
    private final List<TopProductDTO> topProducts = new ArrayList<>();
    private final List<LowStockProductDTO> lowStockProducts = new ArrayList<>();

    @PostConstruct
    public void seed() {
        if (!users.isEmpty()) {
            return;
        }
        Instant now = Instant.now();
        AdminUserDTO admin = new AdminUserDTO(uuid(), "admin@shopcuathuy.com", "System Admin",
                "ADMIN", "ACTIVE", now);
        AdminUserDTO sellerUser = new AdminUserDTO(uuid(), "seller@shopcuathuy.com", "Default Seller",
                "SELLER", "ACTIVE", now);
        AdminUserDTO shipperUser = new AdminUserDTO(uuid(), "shipper@shopcuathuy.com", "Default Shipper",
                "SHIPPER", "ACTIVE", now);
        AdminUserDTO customer = new AdminUserDTO(uuid(), "user1@example.com", "Customer One",
                "CUSTOMER", "ACTIVE", now);
        users.put(admin.getId(), admin);
        users.put(sellerUser.getId(), sellerUser);
        users.put(shipperUser.getId(), shipperUser);
        users.put(customer.getId(), customer);

        AdminSellerDTO seller = new AdminSellerDTO(uuid(), sellerUser.getId(), "Thuy Fashion",
                "thuy-fashion", "APPROVED", now);
        sellers.put(seller.getId(), seller);

        AdminShipmentDTO shipment = new AdminShipmentDTO();
        shipment.setId(uuid());
        shipment.setOrderId(uuid());
        shipment.setSellerId(seller.getId());
        shipment.setShipperId(null);
        shipment.setTrackingNumber(randomTracking());
        shipment.setStatus("READY_FOR_PICKUP");
        shipment.setPickupAddress(Map.of("name", "Thuy Fashion", "address", "HCMC"));
        shipment.setDeliveryAddress(Map.of("name", "Customer One", "address", "HN"));
        shipment.setPackageWeight(1.2);
        shipment.setPackageSize("S");
        shipment.setCodAmount(120000d);
        shipment.setNotes("Handle with care");
        shipment.setCreatedAt(now);
        shipment.setUpdatedAt(now);
        shipments.put(shipment.getId(), shipment);

        AdminVoucherDTO voucher = new AdminVoucherDTO();
        voucher.setId(uuid());
        voucher.setCode("WELCOME10");
        voucher.setDescription("Giảm 10% cho đơn đầu tiên");
        voucher.setType("PERCENTAGE");
        voucher.setValue(10d);
        voucher.setMaxDiscount(50000d);
        voucher.setMinOrderValue(200000d);
        voucher.setUsageLimit(1000);
        voucher.setUsedCount(10);
        voucher.setStartDate(now);
        voucher.setStatus("ACTIVE");
        voucher.setCreatedAt(now);
        voucher.setUpdatedAt(now);
        vouchers.put(voucher.getId(), voucher);

        AdminPromotionDTO promotion = new AdminPromotionDTO();
        promotion.setId(uuid());
        promotion.setSellerId(seller.getId());
        promotion.setName("Flash Sale Cuối Tuần");
        promotion.setDescription("Giảm 30%");
        promotion.setPromotionType("PERCENTAGE");
        promotion.setDiscountValue(30d);
        promotion.setStartDate(now);
        promotion.setEndDate(now.plusSeconds(3 * 24 * 3600));
        promotion.setStatus("ACTIVE");
        promotion.setQuantityLimit(1000);
        promotion.setQuantityUsed(156);
        promotions.put(promotion.getId(), promotion);

        AdminComplaintDTO complaint = new AdminComplaintDTO();
        complaint.setId(uuid());
        complaint.setReporterId(customer.getId());
        complaint.setTargetId(seller.getId());
        complaint.setCategory("ORDER");
        complaint.setTitle("Khiếu nại mẫu");
        complaint.setContent("Đơn hàng giao trễ 2 ngày");
        complaint.setStatus("OPEN");
        complaint.setCreatedAt(now);
        complaint.setUpdatedAt(now);
        complaints.put(complaint.getId(), complaint);

        revenueSeries.clear();
        revenueSeries.addAll(List.of(
                new RevenuePointDTO("01/01", 4_200_000, 1_260_000, 45),
                new RevenuePointDTO("05/01", 5_100_000, 1_530_000, 52),
                new RevenuePointDTO("10/01", 3_800_000, 1_140_000, 38),
                new RevenuePointDTO("15/01", 6_200_000, 1_860_000, 68),
                new RevenuePointDTO("20/01", 5_500_000, 1_650_000, 59),
                new RevenuePointDTO("25/01", 7_100_000, 2_130_000, 75),
                new RevenuePointDTO("30/01", 6_800_000, 2_040_000, 71)
        ));

        categorySeries.clear();
        categorySeries.addAll(List.of(
                new CategoryRevenueDTO("Điện tử", 45_200_000),
                new CategoryRevenueDTO("Thời trang", 32_100_000),
                new CategoryRevenueDTO("Làm đẹp", 28_500_000),
                new CategoryRevenueDTO("Nhà cửa", 19_700_000)
        ));

        customerTypes.clear();
        customerTypes.addAll(List.of(
                new CustomerTypeDTO("Khách mới", 45, "#f59e0b"),
                new CustomerTypeDTO("Khách quay lại", 35, "#d97706"),
                new CustomerTypeDTO("Khách VIP", 20, "#eab308")
        ));

        customerLocations.clear();
        customerLocations.addAll(List.of(
                new CustomerLocationDTO("TP.HCM", 456),
                new CustomerLocationDTO("Hà Nội", 389),
                new CustomerLocationDTO("Đà Nẵng", 234),
                new CustomerLocationDTO("Cần Thơ", 156),
                new CustomerLocationDTO("Khác", 289)
        ));

        trafficSeries.clear();
        trafficSeries.addAll(List.of(
                new TrafficPointDTO("01/01", 1245, 856, 42),
                new TrafficPointDTO("05/01", 1589, 1023, 38),
                new TrafficPointDTO("10/01", 1342, 912, 45),
                new TrafficPointDTO("15/01", 1876, 1234, 35),
                new TrafficPointDTO("20/01", 1654, 1089, 40),
                new TrafficPointDTO("25/01", 2103, 1456, 32),
                new TrafficPointDTO("30/01", 1987, 1345, 36)
        ));

        trafficSources.clear();
        trafficSources.addAll(List.of(
                new TrafficSourceDTO("Tìm kiếm", 3456),
                new TrafficSourceDTO("Mạng xã hội", 2345),
                new TrafficSourceDTO("Trực tiếp", 1876),
                new TrafficSourceDTO("Quảng cáo", 1234),
                new TrafficSourceDTO("Khác", 567)
        ));

        topProducts.clear();
        topProducts.addAll(List.of(
                createTopProduct("1", "iPhone 15 Pro Max 256GB", "/modern-smartphone.png", 128, 3_838_720_000d, "+15%", true),
                createTopProduct("2", "Áo Thun Nam Basic", "/plain-white-tshirt.png", 456, 90_744_000d, "+8%", true),
                createTopProduct("3", "Son Môi Lì Cao Cấp", "/assorted-lipsticks.png", 234, 81_900_000d, "-3%", false)
        ));

        lowStockProducts.clear();
        lowStockProducts.addAll(List.of(
                new LowStockProductDTO("Tai nghe Bluetooth", 5, "critical"),
                new LowStockProductDTO("Ốp lưng iPhone", 12, "warning"),
                new LowStockProductDTO("Cáp sạc Type-C", 18, "warning")
        ));

        NotificationDTO orderNotification = new NotificationDTO();
        orderNotification.setId(uuid());
        orderNotification.setUserId(customer.getId());
        orderNotification.setTitle("Đơn hàng của bạn đang được xử lý");
        orderNotification.setMessage("Đơn hàng #" + shipment.getOrderId().substring(0, 8) + " đang chuẩn bị giao.");
        orderNotification.setType("ORDER");
        orderNotification.setLinkUrl("/orders/" + shipment.getOrderId());
        orderNotification.setImageUrl(null);
        orderNotification.setRead(false);
        orderNotification.setCreatedAt(now);
        addNotification(orderNotification);

        NotificationDTO promoNotification = new NotificationDTO();
        promoNotification.setId(uuid());
        promoNotification.setUserId(customer.getId());
        promoNotification.setTitle("Khuyến mãi mới");
        promoNotification.setMessage("Flash Sale cuối tuần - giảm 30% cho sản phẩm thời trang.");
        promoNotification.setType("PROMOTION");
        promoNotification.setLinkUrl("/flash-sales");
        promoNotification.setImageUrl(null);
        promoNotification.setRead(false);
        promoNotification.setCreatedAt(now.minusSeconds(3600));
        addNotification(promoNotification);
    }

    public List<AdminUserDTO> listUsers(String q, String role, String status) {
        return users.values().stream()
                .filter(u -> q == null || u.getEmail().toLowerCase().contains(q.toLowerCase())
                        || u.getFullName().toLowerCase().contains(q.toLowerCase()))
                .filter(u -> role == null || role.equalsIgnoreCase(u.getUserType()))
                .filter(u -> status == null || status.equalsIgnoreCase(u.getStatus()))
                .sorted(Comparator.comparing(AdminUserDTO::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public AdminUserDTO createUser(CreateUserRequest request) {
        AdminUserDTO user = new AdminUserDTO(uuid(), request.getEmail(), request.getFullName(),
                request.getUserType(), request.getStatus(), Instant.now());
        users.put(user.getId(), user);
        return user;
    }

    public Optional<AdminUserDTO> updateUserStatus(String id, String status) {
        AdminUserDTO user = users.get(id);
        if (user == null) return Optional.empty();
        user.setStatus(status);
        return Optional.of(user);
    }

    public Optional<AdminUserDTO> updateUserRole(String id, String role) {
        AdminUserDTO user = users.get(id);
        if (user == null) return Optional.empty();
        user.setUserType(role);
        return Optional.of(user);
    }

    public boolean deleteUser(String id) {
        return users.remove(id) != null;
    }

    public List<AdminSellerDTO> listSellers(String q, String status) {
        return sellers.values().stream()
                .filter(s -> q == null || s.getShopName().toLowerCase().contains(q.toLowerCase())
                        || s.getSlug().toLowerCase().contains(q.toLowerCase()))
                .filter(s -> status == null || status.equalsIgnoreCase(s.getStatus()))
                .sorted(Comparator.comparing(AdminSellerDTO::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public Optional<AdminSellerDTO> updateSellerStatus(String id, String status) {
        AdminSellerDTO seller = sellers.get(id);
        if (seller == null) return Optional.empty();
        seller.setStatus(status);
        return Optional.of(seller);
    }

    public AdminShipmentDTO createShipment(CreateShipmentRequest request) {
        AdminShipmentDTO shipment = new AdminShipmentDTO();
        shipment.setId(uuid());
        shipment.setOrderId(request.getOrderId());
        shipment.setSellerId(request.getSellerId());
        shipment.setShipperId(request.getShipperId());
        shipment.setTrackingNumber(randomTracking());
        shipment.setStatus(Optional.ofNullable(request.getStatus()).orElse("READY_FOR_PICKUP"));
        shipment.setPickupAddress(request.getPickupAddress());
        shipment.setDeliveryAddress(request.getDeliveryAddress());
        shipment.setPackageWeight(request.getPackageWeight());
        shipment.setPackageSize(request.getPackageSize());
        shipment.setCodAmount(request.getCodAmount());
        shipment.setNotes(request.getNotes());
        shipment.setCreatedAt(Instant.now());
        shipment.setUpdatedAt(Instant.now());
        shipments.put(shipment.getId(), shipment);
        return shipment;
    }

    public List<AdminShipmentDTO> listShipments(String status) {
        return shipments.values().stream()
                .filter(s -> status == null || status.equalsIgnoreCase(s.getStatus()))
                .sorted(Comparator.comparing(AdminShipmentDTO::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public Optional<AdminShipmentDTO> assignShipment(String id, String shipperId) {
        AdminShipmentDTO shipment = shipments.get(id);
        if (shipment == null) return Optional.empty();
        shipment.setShipperId(shipperId);
        shipment.setStatus("PICKED_UP");
        shipment.setUpdatedAt(Instant.now());
        return Optional.of(shipment);
    }

    public Optional<AdminShipmentDTO> updateShipmentStatus(String id, String status) {
        AdminShipmentDTO shipment = shipments.get(id);
        if (shipment == null) return Optional.empty();
        shipment.setStatus(status);
        shipment.setUpdatedAt(Instant.now());
        return Optional.of(shipment);
    }

    public List<AdminVoucherDTO> listVouchers(String q, String status, String type) {
        return vouchers.values().stream()
                .filter(v -> q == null || v.getCode().toLowerCase().contains(q.toLowerCase())
                        || (v.getDescription() != null && v.getDescription().toLowerCase().contains(q.toLowerCase())))
                .filter(v -> status == null || status.equalsIgnoreCase(v.getStatus()))
                .filter(v -> type == null || type.equalsIgnoreCase(v.getType()))
                .sorted(Comparator.comparing(AdminVoucherDTO::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public AdminVoucherDTO createVoucher(CreateVoucherRequest request) {
        AdminVoucherDTO voucher = new AdminVoucherDTO();
        voucher.setId(uuid());
        voucher.setCode(request.getCode());
        voucher.setDescription(request.getDescription());
        voucher.setType(request.getType());
        voucher.setValue(request.getValue());
        voucher.setMaxDiscount(request.getMaxDiscount());
        voucher.setMinOrderValue(request.getMinOrderValue());
        voucher.setUsageLimit(request.getUsageLimit());
        voucher.setUsedCount(0);
        voucher.setStartDate(parseInstantOrNow(request.getStartDate()));
        voucher.setEndDate(parseInstantOrNull(request.getEndDate()));
        voucher.setStatus(Optional.ofNullable(request.getStatus()).orElse("ACTIVE"));
        voucher.setCreatedAt(Instant.now());
        voucher.setUpdatedAt(Instant.now());
        vouchers.put(voucher.getId(), voucher);
        return voucher;
    }

    public Optional<AdminVoucherDTO> updateVoucher(String id, UpdateVoucherRequest request) {
        AdminVoucherDTO voucher = vouchers.get(id);
        if (voucher == null) return Optional.empty();
        if (request.getCode() != null) voucher.setCode(request.getCode());
        if (request.getDescription() != null) voucher.setDescription(request.getDescription());
        if (request.getType() != null) voucher.setType(request.getType());
        if (request.getValue() != null) voucher.setValue(request.getValue());
        if (request.getMaxDiscount() != null) voucher.setMaxDiscount(request.getMaxDiscount());
        if (request.getMinOrderValue() != null) voucher.setMinOrderValue(request.getMinOrderValue());
        if (request.getUsageLimit() != null) voucher.setUsageLimit(request.getUsageLimit());
        if (request.getUsedCount() != null) voucher.setUsedCount(request.getUsedCount());
        if (request.getStartDate() != null) voucher.setStartDate(parseInstantOrNow(request.getStartDate()));
        if (request.getEndDate() != null) voucher.setEndDate(parseInstantOrNull(request.getEndDate()));
        if (request.getStatus() != null) voucher.setStatus(request.getStatus());
        voucher.setUpdatedAt(Instant.now());
        return Optional.of(voucher);
    }

    public boolean deleteVoucher(String id) {
        return vouchers.remove(id) != null;
    }

    public PageResponse<AdminPromotionDTO> listPromotions(String sellerId, int page, int size) {
        List<AdminPromotionDTO> filtered = promotions.values().stream()
                .filter(p -> sellerId == null || sellerId.equals(p.getSellerId()))
                .sorted(Comparator.comparing(AdminPromotionDTO::getStartDate).reversed())
                .collect(Collectors.toList());
        int from = Math.max(page * size, 0);
        int to = Math.min(from + size, filtered.size());
        List<AdminPromotionDTO> pageContent = from >= filtered.size() ? List.of() : filtered.subList(from, to);
        int totalPages = size == 0 ? 1 : (int) Math.ceil((double) filtered.size() / size);
        return new PageResponse<>(pageContent, filtered.size(), totalPages, size, page);
    }

    public AdminPromotionDTO createPromotion(String sellerId, CreatePromotionRequest request) {
        AdminPromotionDTO promotion = new AdminPromotionDTO();
        promotion.setId(uuid());
        String effectiveSellerId = sellerId;
        if (effectiveSellerId == null || !sellers.containsKey(effectiveSellerId)) {
            effectiveSellerId = sellers.keySet().stream().findFirst()
                    .orElseGet(() -> {
                        AdminSellerDTO fallback = new AdminSellerDTO(uuid(), uuid(), "Seller Auto", "auto-seller", "APPROVED", Instant.now());
                        sellers.put(fallback.getId(), fallback);
                        return fallback.getId();
                    });
        }
        promotion.setSellerId(effectiveSellerId);
        promotion.setName(request.getName());
        promotion.setDescription(request.getDescription());
        promotion.setPromotionType(request.getPromotionType());
        promotion.setDiscountValue(request.getDiscountValue());
        Instant start = parseInstantOrNow(request.getStartDate());
        Instant end = parseInstantOrNull(request.getEndDate());
        if (end == null || end.isBefore(start)) {
            end = start.plus(3, ChronoUnit.DAYS);
        }
        promotion.setStartDate(start);
        promotion.setEndDate(end);
        promotion.setStatus(Optional.ofNullable(request.getStatus()).orElse("ACTIVE"));
        promotion.setQuantityLimit(request.getQuantityLimit());
        promotion.setQuantityUsed(0);
        promotions.put(promotion.getId(), promotion);
        return promotion;
    }

    public List<AdminComplaintDTO> listComplaints(String status) {
        return complaints.values().stream()
                .filter(c -> status == null || status.equalsIgnoreCase(c.getStatus()))
                .sorted(Comparator.comparing(AdminComplaintDTO::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public AdminComplaintDTO createComplaint(CreateComplaintRequest request) {
        AdminComplaintDTO complaint = new AdminComplaintDTO();
        complaint.setId(uuid());
        complaint.setReporterId(request.getReporterId());
        complaint.setTargetId(request.getTargetId());
        complaint.setCategory(request.getCategory());
        complaint.setTitle(request.getTitle());
        complaint.setContent(request.getContent());
        complaint.setStatus(Optional.ofNullable(request.getStatus()).orElse("OPEN"));
        complaint.setCreatedAt(Instant.now());
        complaint.setUpdatedAt(Instant.now());
        complaints.put(complaint.getId(), complaint);
        return complaint;
    }

    public Optional<AdminComplaintDTO> updateComplaintStatus(String id, String status) {
        AdminComplaintDTO complaint = complaints.get(id);
        if (complaint == null) return Optional.empty();
        complaint.setStatus(status);
        complaint.setUpdatedAt(Instant.now());
        return Optional.of(complaint);
    }

    public AdminSystemMetricsDTO getMetrics() {
        return metrics;
    }

    public void recordRequest(boolean success) {
        metrics.setRequestCount(metrics.getRequestCount() + 1);
        if (!success) {
            metrics.setErrorCount(metrics.getErrorCount() + 1);
        }
    }

    public PageResponse<NotificationDTO> listNotifications(String userId, int page, int size) {
        List<NotificationDTO> userList = notifications.getOrDefault(userId, List.of());
        List<NotificationDTO> sorted = userList.stream()
                .sorted(Comparator.comparing(NotificationDTO::getCreatedAt).reversed())
                .collect(Collectors.toList());
        int from = Math.max(page * size, 0);
        int to = Math.min(from + size, sorted.size());
        List<NotificationDTO> pageContent = from >= sorted.size() ? List.of() : sorted.subList(from, to);
        int totalPages = size == 0 ? 1 : (int) Math.ceil((double) sorted.size() / size);
        return new PageResponse<>(pageContent, sorted.size(), totalPages, size, page);
    }

    public long getUnreadCount(String userId) {
        return notifications.getOrDefault(userId, List.of()).stream()
                .filter(n -> !n.isRead())
                .count();
    }

    public Optional<NotificationDTO> markAsRead(String userId, String notificationId) {
        List<NotificationDTO> list = notifications.get(userId);
        if (list == null) return Optional.empty();
        for (NotificationDTO notification : list) {
            if (notification.getId().equals(notificationId)) {
                notification.setRead(true);
                return Optional.of(notification);
            }
        }
        return Optional.empty();
    }

    public void markAllAsRead(String userId) {
        List<NotificationDTO> list = notifications.get(userId);
        if (list == null) return;
        list.forEach(n -> n.setRead(true));
    }

    public boolean deleteNotification(String userId, String notificationId) {
        List<NotificationDTO> list = notifications.get(userId);
        if (list == null) return false;
        return list.removeIf(n -> n.getId().equals(notificationId));
    }

    public SellerAnalyticsDashboardDTO getAnalyticsDashboard(String period) {
        SellerAnalyticsDashboardDTO dto = new SellerAnalyticsDashboardDTO();

        SellerAnalyticsOverviewDTO overview = new SellerAnalyticsOverviewDTO();
        overview.setRevenue(125_500_000d);
        overview.setRevenueChange(24.5);
        overview.setOrders(1_234);
        overview.setOrdersChange(18.2);
        overview.setAverageOrderValue(1_020_000d);
        overview.setAverageOrderValueChange(-5.3);
        overview.setConversionRate(3.24);
        overview.setConversionRateChange(0.8);
        dto.setOverview(overview);

        dto.setRevenueSeries(revenueSeries);
        dto.setCategorySeries(categorySeries);
        dto.setCustomerTypes(customerTypes);
        dto.setCustomerLocations(customerLocations);
        dto.setTrafficSeries(trafficSeries);
        dto.setTrafficSources(trafficSources);
        dto.setTopProducts(topProducts);
        dto.setLowStockProducts(lowStockProducts);

        return dto;
    }

    private void addNotification(NotificationDTO notification) {
        notifications.computeIfAbsent(
                notification.getUserId(),
                key -> new ArrayList<>()
        ).add(notification);
    }

    private TopProductDTO createTopProduct(String id, String name, String image, int sold, double revenue, String trend, boolean up) {
        TopProductDTO dto = new TopProductDTO();
        dto.setId(id);
        dto.setName(name);
        dto.setImage(image);
        dto.setSold(sold);
        dto.setRevenue(revenue);
        dto.setTrend(trend);
        dto.setTrendUp(up);
        return dto;
    }

    public SellerOverviewDTO getSellerOverview(String sellerId) {
        // Demo numbers; in real implementation compute from DB
        return new SellerOverviewDTO(totalProducts, totalOrders, totalCustomers, totalRevenue);
    }

    private static String uuid() {
        return UUID.randomUUID().toString();
    }

    private static String randomTracking() {
        return "TRK" + ThreadLocalRandom.current().nextInt(100000, 999999);
    }

    private static Instant parseInstantOrNow(String value) {
        Instant parsed = parseInstantOrNull(value);
        return parsed != null ? parsed : Instant.now();
    }

    private static Instant parseInstantOrNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Instant.parse(value);
        } catch (Exception e) {
            return null;
        }
    }
}

