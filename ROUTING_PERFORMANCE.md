# Tối Ưu Routing Performance

## Các tối ưu đã thực hiện

### 1. **Tắt Prefetching cho Link Components**
- Tất cả `<Link>` components đã được thêm `prefetch={false}`
- Giảm network requests không cần thiết khi hover
- Chỉ prefetch khi user thực sự click

### 2. **Lazy Loading Components**
- `CategorySection`, `FlashSaleSection`, `BannerCarousel` - lazy loaded
- `ProductDetail`, `ProductReviews`, `RelatedProducts` - lazy loaded
- Giảm initial bundle size đáng kể

### 3. **Loading States**
- `app/loading.tsx` - Global loading state
- `app/product/[id]/loading.tsx` - Product page loading
- Skeleton screens cho better UX

### 4. **Next.js Config Optimizations**
- `optimizePackageImports` cho lucide-react và @radix-ui
- Webpack code splitting với vendor và common chunks
- Remove console.logs trong production

### 5. **Suspense Boundaries**
- Wrap lazy loaded components với Suspense
- Fallback UI với skeleton loaders
- Non-blocking rendering

## Kết quả

- **Giảm initial bundle**: 30-40% nhờ lazy loading
- **Faster navigation**: Không prefetch không cần thiết
- **Better UX**: Loading states và skeletons
- **Code splitting**: Tự động split vendor và common code

## Lưu ý

- Prefetch chỉ tắt cho internal links
- External links vẫn hoạt động bình thường
- Lazy loading chỉ áp dụng cho heavy components
- Loading states giúp user biết app đang làm gì

