'use client'

import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProductCard } from "@/components/product/product-card"
import { CategorySection } from "@/components/home/category-section"
import { FlashSaleSection } from "@/components/home/flash-sale-section"
import { BannerCarousel } from "@/components/home/banner-carousel"
import { useFeaturedProducts } from "@/hooks/useProducts"
import { Product } from "@/lib/api/products"

export default function HomePage() {
  const { products, loading } = useFeaturedProducts(0, 24)

  // Transform API product to component product format
  const transformProduct = (product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.comparePrice,
    image: product.primaryImage || product.images?.[0] || '/placeholder.svg',
    rating: product.rating || 0,
    sold: product.totalSold || 0,
    discount: product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : undefined,
    category: product.categoryName,
  })

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Categories */}
        <CategorySection />

        {/* Flash Sale */}
        <FlashSaleSection />

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">GỢI Ý HÔM NAY</h2>
          </div>
          {loading ? (
            <div className="text-center py-8">Đang tải sản phẩm...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={transformProduct(product)} />
                ))}
              </div>
              {/* Load More */}
              <div className="mt-8 text-center">
                <button className="rounded-sm border border-border bg-background px-12 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  Xem Thêm
                </button>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
