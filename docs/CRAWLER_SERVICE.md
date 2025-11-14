# Crawler Service Documentation

## Overview

The crawler service allows you to crawl products from various Vietnamese e-commerce platforms (Shopee, Lazada, Tiki, Sendo) by category and export them to Excel files.

## Features

- **Multi-platform support**: Shopee, Lazada, Tiki, Sendo
- **Category-based crawling**: Crawl products by category
- **Export to Excel**: Automatically export crawled products to Excel format
- **Error handling**: Robust error handling with fallback mechanisms
- **Rate limiting protection**: Handles API rate limiting gracefully

## API Endpoint

### POST `/api/seller/products/crawl/category`

Crawl products from a specific category on a given platform.

#### Request Body

\`\`\`json
{
  "category": "dien-thoai-phu-kien",
  "platform": "shopee",
  "limit": 50,
  "page": 1
}
\`\`\`

#### Parameters

- `category` (required): Category slug (e.g., "dien-thoai-phu-kien")
- `platform` (optional): Platform name - "shopee", "lazada", "tiki", or "sendo" (default: "shopee")
- `limit` (optional): Number of products to crawl (max: 500, default: 50)
- `page` (optional): Page number (default: 1)

#### Response

\`\`\`json
{
  "success": true,
  "data": {
    "category": "dien-thoai-phu-kien",
    "platform": "shopee",
    "total": 50,
    "products": [
      {
        "name": "Product Name",
        "description": "Product Description",
        "price": 1000000,
        "comparePrice": 1200000,
        "images": ["https://..."],
        "category": "dien-thoai-phu-kien",
        "sku": "123456",
        "url": "https://shopee.vn/product/..."
      }
    ],
    "errors": []
  }
}
\`\`\`

## Supported Categories

### Shopee
- `dien-thoai-phu-kien` - Điện Thoại & Phụ Kiện
- `thoi-trang-nam` - Thời Trang Nam
- `thiet-bi-dien-tu` - Thiết Bị Điện Tử
- `may-tinh-laptop` - Máy Tính & Laptop
- `may-anh-may-quay-phim` - Máy Ảnh & Máy Quay Phim
- `dong-ho` - Đồng Hồ
- And more...

### Tiki
- `dien-thoai-phu-kien` - Điện Thoại & Phụ Kiện
- `thoi-trang-nam` - Thời Trang Nam
- `thiet-bi-dien-tu` - Thiết Bị Điện Tử
- `may-tinh-laptop` - Máy Tính & Laptop
- And more...

### Lazada & Sendo
- Limited category support (may require additional configuration)

## Usage Example

### From Frontend

\`\`\`typescript
import { sellerApi } from '@/lib/api/seller'

const response = await sellerApi.crawlCategory({
  category: 'dien-thoai-phu-kien',
  platform: 'shopee',
  limit: 50
})

if (response.success) {
  console.log(`Crawled ${response.data.total} products`)
  // Products are automatically exported to Excel
}
\`\`\`

### Direct API Call

\`\`\`bash
curl -X POST http://localhost:3000/api/seller/products/crawl/category \
  -H "Content-Type: application/json" \
  -d '{
    "category": "dien-thoai-phu-kien",
    "platform": "shopee",
    "limit": 50
  }'
\`\`\`

## Limitations & Considerations

### Rate Limiting
- E-commerce platforms may implement rate limiting
- If you encounter rate limiting, wait a few minutes before retrying
- Consider reducing the `limit` parameter

### API Changes
- E-commerce platforms may change their API structure
- The crawler may need updates if APIs change
- Shopee API is generally more stable than others

### Legal Considerations
- Ensure compliance with platform terms of service
- Use crawled data responsibly
- Consider using official APIs when available

### Performance
- Crawling can take time depending on the number of products
- Large limits may result in timeouts
- Consider pagination for large datasets

## Error Handling

The crawler handles various error scenarios:

- **API Rate Limiting**: Returns error message with suggestion to retry later
- **Timeout Errors**: Suggests reducing the limit
- **Invalid Category**: Returns error with available categories
- **Network Errors**: Returns descriptive error message

## Backend Integration

If you have a separate backend server, the crawler will:
1. First try to use the backend endpoint (`/seller/products/crawl/category`)
2. Fall back to local crawling if backend is not available
3. Forward authentication headers if provided

## Future Improvements

- [ ] Add support for more categories
- [ ] Implement caching to reduce API calls
- [ ] Add retry logic with exponential backoff
- [ ] Support for product details crawling
- [ ] Add proxy support for rate limiting
- [ ] Implement web scraping fallback for platforms without API

## Troubleshooting

### No products found
- Check if the category is supported for the selected platform
- Verify the category slug is correct
- Try a different platform

### Rate limiting errors
- Wait a few minutes before retrying
- Reduce the limit parameter
- Try a different platform

### Timeout errors
- Reduce the limit parameter
- Check your network connection
- Try again later

## Support

For issues or questions, please check:
- API documentation
- Platform-specific API documentation
- Error messages in the response







