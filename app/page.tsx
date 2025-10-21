import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProductCard } from "@/components/product/product-card"
import { CategorySection } from "@/components/home/category-section"
import { FlashSaleSection } from "@/components/home/flash-sale-section"
import { BannerCarousel } from "@/components/home/banner-carousel"
import { DownloadAppSection } from "@/components/home/download-app-section"
import { featuredProducts } from "@/lib/products"

export default function HomePage() {
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* Load More */}
          <div className="mt-8 text-center">
            <button className="rounded-sm border border-border bg-background px-12 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Xem Thêm
            </button>
          </div>
        </section>

        <DownloadAppSection />
      </main>
      <Footer />
    </div>
  )
}
