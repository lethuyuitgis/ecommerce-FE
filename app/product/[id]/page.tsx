'use client'

import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProductDetail } from "@/components/product/product-detail"
import { ProductReviews } from "@/components/product/product-reviews"
import { RelatedProducts } from "@/components/product/related-products"
import { notFound } from "next/navigation"
import { useProduct } from "@/hooks/useProducts"

export default function ProductPage({ params }: { params: { id: string } }) {
  const { product, loading, error } = useProduct(params.id)

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">Đang tải sản phẩm...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    notFound()
  }

  // Transform API product to component format
  const transformedProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.comparePrice,
    image: product.primaryImage || product.images?.[0] || '/placeholder.svg',
    images: product.images || [product.primaryImage || '/placeholder.svg'].filter(Boolean),
    rating: product.rating || 0,
    sold: product.totalSold || 0,
    category: product.categoryName,
    quantity: product.quantity || 0,
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer">Trang chủ</span>
            <span className="mx-2">/</span>
            <span className="hover:text-primary cursor-pointer">{product.categoryName || 'Danh mục'}</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Product Detail */}
          <ProductDetail product={transformedProduct} />

          {/* Product Description */}
          <div className="mt-6 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">CHI TIẾT SẢN PHẨM</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.categoryName && (
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Danh Mục</span>
                  <span className="text-foreground">{product.categoryName}</span>
                </div>
              )}
              {product.sellerName && (
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Người Bán</span>
                  <span className="text-foreground">{product.sellerName}</span>
                </div>
              )}
              {product.sku && (
                <div className="flex">
                  <span className="w-32 text-muted-foreground">SKU</span>
                  <span className="text-foreground">{product.sku}</span>
                </div>
              )}
              <div className="flex">
                <span className="w-32 text-muted-foreground">Số Lượng</span>
                <span className="text-foreground">{product.quantity} sản phẩm</span>
              </div>
            </div>
          </div>

          {/* Product Description Content */}
          {product.description && (
            <div className="mt-6 rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold">MÔ TẢ SẢN PHẨM</h2>
              <div className="prose max-w-none text-sm text-muted-foreground">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            </div>
          )}

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
