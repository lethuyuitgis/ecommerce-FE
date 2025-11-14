package com.shopcuathuy.service;

import com.shopcuathuy.admin.dto.PageResponse;
import com.shopcuathuy.dto.ReviewDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);

    private final Map<String, List<ReviewRecord>> reviewsByProduct = new ConcurrentHashMap<>();

    public ReviewService() {
        seedDemoData();
    }

    public PageResponse<ReviewDTO> getProductReviews(String productId, int page, int size) {
        List<ReviewRecord> allReviews = reviewsByProduct.getOrDefault(productId, List.of());
        int effectiveSize = size <= 0 ? 20 : size;
        int start = Math.max(page * effectiveSize, 0);
        int end = Math.min(start + effectiveSize, allReviews.size());

        List<ReviewDTO> content = start >= allReviews.size()
                ? List.of()
                : allReviews.subList(start, end).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        int totalPages = effectiveSize == 0 ? 1 : (int) Math.ceil((double) allReviews.size() / effectiveSize);

        return new PageResponse<>(content, allReviews.size(), totalPages, effectiveSize, page);
    }

    public ReviewDTO createReview(
            String userId,
            String productId,
            Integer rating,
            String title,
            String comment,
            String orderItemId,
            List<MultipartFile> images,
            List<MultipartFile> videos
    ) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        ReviewRecord review = new ReviewRecord();
        review.setId(UUID.randomUUID().toString());
        review.setProductId(productId);
        review.setUserId(userId != null ? userId : "anonymous");
        review.setUserName(userId != null ? "Người dùng " + userId.substring(0, Math.min(6, userId.length()))
                : "Khách vãng lai");
        review.setUserAvatar("/placeholders/avatar-" + ((int) (Math.random() * 5) + 1) + ".png");
        review.setRating(rating);
        review.setTitle(title);
        review.setComment(comment);
        review.setHelpfulCount(0);
        review.setCreatedAt(LocalDateTime.now());

        review.setImages(extractFileUrls(images, "review-images"));
        review.setVideos(extractFileUrls(videos, "review-videos"));

        reviewsByProduct.computeIfAbsent(productId, key -> new ArrayList<>())
                .add(0, review);

        return toDTO(review);
    }

    public void markHelpful(String userId, String reviewId) {
        reviewsByProduct.values().stream()
                .flatMap(List::stream)
                .filter(review -> review.getId().equals(reviewId))
                .findFirst()
                .ifPresent(review -> review.setHelpfulCount(review.getHelpfulCount() + 1));
    }

    private List<String> extractFileUrls(List<MultipartFile> files, String folder) {
        if (files == null || files.isEmpty()) {
            return List.of();
        }

        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                String safeName = file.getOriginalFilename() != null
                        ? file.getOriginalFilename().replaceAll("\\s+", "-")
                        : UUID.randomUUID().toString();
                urls.add("/uploads/" + folder + "/" + safeName);
            }
        }
        return urls;
    }

    private ReviewDTO toDTO(ReviewRecord review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setProductId(review.getProductId());
        dto.setUserId(review.getUserId());
        dto.setUserName(review.getUserName());
        dto.setUserAvatar(review.getUserAvatar());
        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setComment(review.getComment());
        dto.setImages(review.getImages());
        dto.setVideos(review.getVideos());
        dto.setHelpfulCount(review.getHelpfulCount());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    private void seedDemoData() {
        String defaultProductId = "demo-product";
        List<ReviewRecord> demo = List.of(
                createDemoReview(defaultProductId, 5, "Sản phẩm tuyệt vời", "Chất lượng vượt mong đợi, sẽ ủng hộ thêm.", "Nguyễn Văn A"),
                createDemoReview(defaultProductId, 4, "Đóng gói cẩn thận", "Hàng giao nhanh, đóng gói kỹ. Sẽ mua lại.", "Trần Thị B"),
                createDemoReview(defaultProductId, 3, "Ổn trong tầm giá", "Chất lượng ổn, phù hợp với mức giá này.", "Lê Văn C")
        );
        reviewsByProduct.put(defaultProductId, new ArrayList<>(demo));
    }

    private ReviewRecord createDemoReview(String productId, int rating, String title, String comment, String userName) {
        ReviewRecord review = new ReviewRecord();
        review.setId(UUID.randomUUID().toString());
        review.setProductId(productId);
        review.setUserId(UUID.randomUUID().toString());
        review.setUserName(userName);
        review.setUserAvatar("/placeholders/avatar-" + ((int) (Math.random() * 5) + 1) + ".png");
        review.setRating(rating);
        review.setTitle(title);
        review.setComment(comment);
        review.setImages(Collections.emptyList());
        review.setVideos(Collections.emptyList());
        review.setHelpfulCount((int) (Math.random() * 10));
        review.setCreatedAt(LocalDateTime.now().minusDays((long) (Math.random() * 10)));
        return review;
    }

    private static class ReviewRecord {
        private String id;
        private String productId;
        private String userId;
        private String userName;
        private String userAvatar;
        private int rating;
        private String title;
        private String comment;
        private List<String> images = List.of();
        private List<String> videos = List.of();
        private int helpfulCount;
        private LocalDateTime createdAt;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getUserAvatar() { return userAvatar; }
        public void setUserAvatar(String userAvatar) { this.userAvatar = userAvatar; }
        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
        public List<String> getImages() { return images; }
        public void setImages(List<String> images) { this.images = images; }
        public List<String> getVideos() { return videos; }
        public void setVideos(List<String> videos) { this.videos = videos; }
        public int getHelpfulCount() { return helpfulCount; }
        public void setHelpfulCount(int helpfulCount) { this.helpfulCount = helpfulCount; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}

