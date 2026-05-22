import { Suspense } from "react"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProductCard } from "@/components/product/product-card"
import { serverProductsApi, serverCategoriesApi } from "@/lib/api/server"
import { Product } from "@/lib/api/products"
import { CategorySection } from "@/components/home/category-section"
import { FlashSaleSection } from "@/components/home/flash-sale-section"
import { BannerCarousel } from "@/components/home/banner-carousel"

export default async function HomePage() {
  // Parallel fetch on server for speed
  const [featuredRes, categoriesRes, flashSaleRes] = await Promise.all([
    serverProductsApi.getFeatured(0, 24),
    serverCategoriesApi.getAll(),
    serverProductsApi.getFlashSales(0, 24)
  ])

  let products: Product[] = []
  if (featuredRes.success && featuredRes.data) {
    products = Array.isArray(featuredRes.data) 
      ? featuredRes.data 
      : ((featuredRes.data as any).content || [])
  }

  // Fallback to all products if no featured products
  if (products.length === 0) {
    const allRes = await serverProductsApi.getAll(0, 24)
    if (allRes.success && allRes.data) {
      products = Array.isArray(allRes.data) ? allRes.data : (allRes.data.content || [])
    }
  }

  const initialCategories = categoriesRes.success ? (categoriesRes.data || []) : []
  const initialFlashSaleProducts = flashSaleRes.success && flashSaleRes.data 
    ? (Array.isArray(flashSaleRes.data) ? flashSaleRes.data : ((flashSaleRes.data as any).content || []))
    : []

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Banner Carousel */}
        <Suspense fallback={<div className="h-64 bg-muted animate-pulse" />}>
          <BannerCarousel />
        </Suspense>

        {/* Categories */}
        <Suspense fallback={<div className="h-32 bg-muted animate-pulse" />}>
          <CategorySection initialCategories={initialCategories} />
        </Suspense>

        {/* Flash Sale */}
        <Suspense fallback={<div className="h-64 bg-muted animate-pulse" />}>
          <FlashSaleSection initialProducts={initialFlashSaleProducts} />
        </Suspense>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">GỢI Ý HÔM NAY</h2>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-8">Không có sản phẩm nào để hiển thị</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
