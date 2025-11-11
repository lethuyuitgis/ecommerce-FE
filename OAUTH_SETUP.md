# Hướng dẫn cấu hình OAuth (Google & Facebook)

## 1. Cấu hình Google OAuth

### Bước 1: Tạo OAuth 2.0 Client ID trong Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Chọn **Web application**
6. Cấu hình:
   - **Name**: Tên ứng dụng của bạn
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (cho development)
     - `https://yourdomain.com` (cho production)
   - **Authorized redirect URIs**: 
     - `http://localhost:3000` (cho development)
     - `https://yourdomain.com` (cho production)
7. Copy **Client ID**

### Bước 2: Thêm Client ID vào file .env.local

Tạo file `.env.local` trong thư mục root của project:

\`\`\`env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
\`\`\`

## 2. Cấu hình Facebook OAuth

### Bước 1: Tạo Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Vào **My Apps** > **Create App**
3. Chọn **Consumer** > **Next**
4. Điền thông tin app:
   - **App Display Name**: Tên ứng dụng
   - **App Contact Email**: Email của bạn
5. Vào **Settings** > **Basic**
6. Thêm **App Domains**:
   - `localhost` (cho development)
   - `yourdomain.com` (cho production)
7. Thêm **Website**:
   - Site URL: `http://localhost:3000` (cho development)
   - Site URL: `https://yourdomain.com` (cho production)
8. Vào **Products** > **Facebook Login** > **Settings**
9. Thêm **Valid OAuth Redirect URIs**:
   - `http://localhost:3000` (cho development)
   - `https://yourdomain.com` (cho production)
10. Vào **Settings** > **Basic** > cuộn xuống phần **Data Deletion Instructions URL**:
    - **BẮT BUỘC** để submit app review hoặc chuyển sang Live Mode
    - Có 2 lựa chọn:
      
      **Lựa chọn 1: Data Deletion Instructions URL (Trang hướng dẫn)**
      - Thêm URL trang hướng dẫn xóa dữ liệu:
        - Development: `http://localhost:3000/data-deletion`
        - Production: `https://yourdomain.com/data-deletion`
      - Trang này đã được tạo sẵn tại `app/data-deletion/page.tsx`
      
      **Lựa chọn 2: Data Deletion Callback URL (API endpoint)**
      - Thêm URL endpoint xử lý xóa dữ liệu:
        - Development: `http://localhost:8080/api/facebook/data-deletion`
        - Production: `https://yourdomain.com/api/facebook/data-deletion`
      - Endpoint đã được tạo sẵn trong backend tại `FacebookDataDeletionController`
      - Facebook sẽ gọi endpoint này với POST request khi người dùng yêu cầu xóa dữ liệu
      
    - **Khuyến nghị**: Sử dụng **Lựa chọn 1** (trang hướng dẫn) vì đơn giản hơn
    - Lưu ý: 
      - URL phải là HTTPS trong production
      - Có thể sử dụng cả hai, nhưng ít nhất phải có một trong hai
11. Copy **App ID** và **App Secret**

### Bước 2: Thêm App ID vào file .env.local

Thêm vào file `.env.local`:

\`\`\`env
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id-here
\`\`\`

## 3. Cấu hình Backend

Thêm vào file `e-commerce-backend/src/main/resources/application.yml`:

\`\`\`yaml
oauth:
  google:
    client-id: ${GOOGLE_CLIENT_ID:}
  facebook:
    app-id: ${FACEBOOK_APP_ID:}
    app-secret: ${FACEBOOK_APP_SECRET:}
\`\`\`

Và thêm vào file `.env` của backend (hoặc set environment variables):

\`\`\`env
GOOGLE_CLIENT_ID=your-google-client-id-here
FACEBOOK_APP_ID=your-facebook-app-id-here
FACEBOOK_APP_SECRET=your-facebook-app-secret-here
\`\`\`

## 4. Lưu ý quan trọng

1. **Google OAuth**: 
   - Đảm bảo đã thêm đúng **Authorized JavaScript origins** và **Authorized redirect URIs**
   - Nếu bị lỗi "Access blocked", kiểm tra lại cấu hình trong Google Cloud Console

2. **Facebook OAuth**:
   - Đảm bảo app đã được chuyển sang **Live Mode** nếu muốn test với người dùng thật
   - Thêm test users trong **Roles** > **Test Users** nếu app đang ở **Development Mode**
   - **Data Deletion Callback URL**: 
     - **BẮT BUỘC** để submit app review
     - URL endpoint: `http://localhost:8080/api/facebook/data-deletion` (development)
     - URL endpoint: `https://yourdomain.com/api/facebook/data-deletion` (production)
     - Endpoint đã được tạo sẵn trong backend, chỉ cần thêm URL vào Facebook App Settings
     - URL phải là HTTPS trong production

3. **Environment Variables**:
   - File `.env.local` không được commit lên git (đã có trong `.gitignore`)
   - Restart server sau khi thay đổi environment variables

## 5. Kiểm tra cấu hình

1. Kiểm tra console browser có lỗi gì không
2. Kiểm tra Network tab xem có request đến Google/Facebook không
3. Kiểm tra environment variables đã được load đúng chưa:
   \`\`\`javascript
   console.log('Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
   console.log('Facebook App ID:', process.env.NEXT_PUBLIC_FACEBOOK_APP_ID)
   \`\`\`

4. Kiểm tra Facebook Data Deletion endpoint:
   - Mở browser và truy cập: `http://localhost:8080/api/facebook/data-deletion`
   - Nếu thấy response `{"status":"ok","message":"Data deletion endpoint is active"}` thì endpoint đã hoạt động
   - Thêm URL này vào Facebook App Settings > Data Deletion Instructions URL

## 6. Xử lý lỗi thường gặp

### Lỗi "Hiện không đủ điều kiện để gửi - Xóa dữ liệu người dùng"
- **Nguyên nhân**: Facebook yêu cầu phải có Data Deletion Instructions URL hoặc Data Deletion Callback URL
- **Giải pháp**: 
  
  **Cách 1: Sử dụng trang hướng dẫn (Khuyến nghị)**
  1. Đảm bảo frontend đang chạy trên port 3000
  2. Truy cập: `http://localhost:3000/data-deletion` để kiểm tra trang đã hoạt động
  3. Thêm URL: `http://localhost:3000/data-deletion` vào Facebook App Settings > Data Deletion Instructions URL
  4. Nếu dùng production, thay bằng URL HTTPS: `https://yourdomain.com/data-deletion`
  
  **Cách 2: Sử dụng API endpoint**
  1. Đảm bảo backend đang chạy trên port 8080
  2. Truy cập: `http://localhost:8080/api/facebook/data-deletion` để kiểm tra endpoint
  3. Thêm URL: `http://localhost:8080/api/facebook/data-deletion` vào Facebook App Settings > Data Deletion Callback URL
  4. Nếu dùng production, thay bằng URL HTTPS: `https://yourdomain.com/api/facebook/data-deletion`
  5. Endpoint đã được tạo sẵn trong `FacebookDataDeletionController.java`
  
  **Lưu ý**: Bạn chỉ cần sử dụng một trong hai cách trên, không cần cả hai
