# WebSocket Setup Guide

## Vấn đề

WebSocket connection failed: `ws://localhost:8080/ws`

## Nguyên nhân

1. Backend chưa cấu hình WebSocket endpoint
2. Backend chưa chạy hoặc chưa hỗ trợ WebSocket
3. URL WebSocket không đúng

## Giải pháp

### 1. Kiểm tra Backend WebSocket Configuration

Backend cần có cấu hình WebSocket. Kiểm tra file `WebSocketConfig.java`:

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
```

### 2. Cấu hình Environment Variable (Tùy chọn)

Tạo file `.env.local`:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Fallback Behavior

Hệ thống đã được cấu hình để:
- **WebSocket hoạt động**: Nhận thông báo real-time
- **WebSocket không hoạt động**: Tự động chuyển sang polling (kiểm tra mỗi 30 giây)

### 4. Disable WebSocket (Nếu không cần)

Nếu không muốn dùng WebSocket, có thể disable bằng cách:

1. Không set `NEXT_PUBLIC_WS_URL`
2. Đảm bảo backend không có WebSocket endpoint
3. Hệ thống sẽ tự động dùng polling

## Test WebSocket

### Test với curl:

```bash
# Test WebSocket endpoint (cần websocat hoặc wscat)
wscat -c ws://localhost:8080/ws
```

### Test trong Browser Console:

```javascript
const ws = new WebSocket('ws://localhost:8080/ws');
ws.onopen = () => console.log('Connected');
ws.onerror = (e) => console.error('Error', e);
ws.onclose = () => console.log('Closed');
```

## Lưu ý

- WebSocket là tính năng tùy chọn, hệ thống vẫn hoạt động bình thường với polling
- Lỗi WebSocket không ảnh hưởng đến các chức năng khác
- Trong production, nên dùng `wss://` (WebSocket Secure) thay vì `ws://`


