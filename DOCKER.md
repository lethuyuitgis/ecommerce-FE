# Docker Setup Guide

Hướng dẫn build và chạy ứng dụng E-commerce bằng Docker.

## Yêu cầu

- Docker >= 20.10
- Docker Compose >= 2.0

## Cấu trúc Docker

### Services

1. **MinIO** - Object Storage (port 9000, console 9090)
2. **Backend** - Spring Boot API (port 8080)
3. **Frontend** - Next.js (port 3000)

## Build và Chạy

### Production Mode

```bash
# Build và chạy tất cả services
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

### Development Mode

```bash
# Chạy chỉ MinIO và Backend (frontend chạy local)
docker-compose -f docker-compose.dev.yml up -d

# Xem logs
docker-compose -f docker-compose.dev.yml logs -f
```

## Build từng service riêng

### Backend

```bash
cd e-commerce-backend
docker build -t ecommerce-backend:latest .
docker run -p 8080:8080 ecommerce-backend:latest
```

### Frontend

```bash
docker build -t ecommerce-frontend:latest .
docker run -p 3000:3000 ecommerce-frontend:latest
```

## Environment Variables

### Backend

- `SPRING_PROFILES_ACTIVE`: production hoặc dev
- `NEXT_PUBLIC_API_URL`: URL của API backend
- `MINIO_ENDPOINT`: MinIO endpoint
- `MINIO_ACCESS_KEY`: MinIO access key
- `MINIO_SECRET_KEY`: MinIO secret key

### Frontend

- `NODE_ENV`: production hoặc development
- `NEXT_PUBLIC_API_URL`: URL của API backend
- `NEXT_PUBLIC_WS_URL`: WebSocket URL
- `NEXT_PUBLIC_MINIO_URL`: MinIO URL

## MinIO Setup

Sau khi MinIO chạy:

1. Truy cập http://localhost:9090
2. Đăng nhập với:
   - Username: `admin`
   - Password: `admin123456`
3. Tạo bucket: `product-images` hoặc bucket bạn cần
4. Set bucket policy thành public read nếu cần

## Health Checks

- Backend: http://localhost:8080/actuator/health
- Frontend: http://localhost:3000
- MinIO: http://localhost:9000/minio/health/live

## Troubleshooting

### Port đã được sử dụng

```bash
# Kiểm tra port đang được sử dụng
lsof -i :3000
lsof -i :8080
lsof -i :9000

# Dừng service đang dùng port
docker-compose down
```

### Rebuild từ đầu

```bash
# Xóa tất cả containers, images, volumes
docker-compose down -v --rmi all

# Build lại
docker-compose up -d --build
```

### Xem logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ frontend
docker-compose logs -f frontend
```

## Production Deployment

### Build images

```bash
# Build và tag images
docker build -t ecommerce-backend:latest ./e-commerce-backend
docker build -t ecommerce-frontend:latest .

# Push to registry (nếu có)
docker tag ecommerce-backend:latest your-registry/ecommerce-backend:latest
docker tag ecommerce-frontend:latest your-registry/ecommerce-frontend:latest
docker push your-registry/ecommerce-backend:latest
docker push your-registry/ecommerce-frontend:latest
```

### Security Notes

- Thay đổi MinIO credentials trong production
- Sử dụng secrets management cho sensitive data
- Enable HTTPS trong production
- Cấu hình firewall rules

