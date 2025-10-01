import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { ProductReviews } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"
import { featuredProducts } from "@/lib/products"
import { notFound } from "next/navigation"

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = featuredProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="hover:text-primary">Trang chủ</span>
            <span className="mx-2">/</span>
            <span className="hover:text-primary">Danh mục</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Product Detail */}
          <ProductDetail product={product} />

          {/* Product Description */}
          <div className="mt-6 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">CHI TIẾT SẢN PHẨM</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex">
                <span className="w-32 text-muted-foreground">Danh Mục</span>
                <span className="text-foreground">Thời Trang Nam</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Thương Hiệu</span>
                <span className="text-foreground">No Brand</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Xuất Xứ</span>
                <span className="text-foreground">Việt Nam</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Chất Liệu</span>
                <span className="text-foreground">Cotton 100%</span>
              </div>
            </div>
          </div>

          {/* Product Description Content */}
          <div className="mt-6 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">MÔ TẢ SẢN PHẨM</h2>
            <div className="prose max-w-none text-sm text-muted-foreground">
              <p className="mb-4">
                Sản phẩm chất lượng cao, được làm từ nguyên liệu tốt nhất. Thiết kế hiện đại, phù hợp với mọi lứa tuổi.
              </p>
              <p className="mb-4">Đặc điểm nổi bật:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chất liệu cao cấp, bền đẹp</li>
                <li>Thiết kế thời trang, hiện đại</li>
                <li>Dễ dàng phối đồ</li>
                <li>Giá cả phải chăng</li>
              </ul>
            </div>
          </div>

          {/* Reviews */}
          <ProductReviews productId={product.id} />

          {/* Related Products */}
          <RelatedProducts currentProductId={product.id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
