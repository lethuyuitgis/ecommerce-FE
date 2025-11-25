import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProductDetail } from "@/components/product/product-detail"
import { ProductReviews } from "@/components/product/product-reviews"
import { RelatedProducts } from "@/components/product/related-products"
import { notFound } from "next/navigation"
import { serverProductsApi, serverReviewsApi, serverWishlistApi, serverOrdersApi } from "@/lib/api/server"
import { cookies, headers } from "next/headers"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params
  const cookieStore = await cookies()
  const headersList = await headers()
  
  // Fetch product, reviews, related products, wishlist status, and purchase status in parallel
  const [productResponse, reviewsResponse, relatedProductsResponse, wishlistResponse, purchaseResponse] = await Promise.all([
    serverProductsApi.getById(resolvedParams.id),
    serverReviewsApi.getProductReviews(resolvedParams.id, 0, 10),
    serverProductsApi.getFeatured(0, 12),
    serverWishlistApi.checkWishlist(resolvedParams.id, cookieStore, headersList),
    serverOrdersApi.checkPurchase(resolvedParams.id, cookieStore, headersList),
  ])
  
  if (!productResponse.success || !productResponse.data) {
    notFound()
  }
  
  const product = productResponse.data
  const reviews = reviewsResponse.success && reviewsResponse.data ? reviewsResponse.data.content : []
  const relatedProducts = relatedProductsResponse.success && relatedProductsResponse.data 
    ? relatedProductsResponse.data.content.filter(p => p.id !== product.id).slice(0, 6)
    : []
  const inWishlist = wishlistResponse.success && wishlistResponse.data === true
  const purchaseStatus = purchaseResponse.success && purchaseResponse.data ? purchaseResponse.data : { hasPurchased: false }
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Purchase status response:', {
      success: purchaseResponse.success,
      data: purchaseResponse.data,
      message: purchaseResponse.message,
      finalPurchaseStatus: purchaseStatus,
    })
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
    totalReviews: product.totalReviews || 0,
    category: product.categoryName,
    quantity: product.quantity || 0,
  }

  // Extract variants from product
  const variants = product.variants ? {
    sizes: Array.isArray(product.variants.sizes) ? product.variants.sizes : [],
    colors: Array.isArray(product.variants.colors) ? product.variants.colors : [],
  } : undefined

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
          <ProductDetail 
            product={transformedProduct} 
            variants={variants}
            sellerId={product.sellerId}
            sellerName={product.sellerName}
            initialInWishlist={inWishlist} 
          />

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
          <ProductReviews 
            productId={product.id} 
            initialReviews={reviews}
            initialTotalPages={reviewsResponse.success && reviewsResponse.data ? reviewsResponse.data.totalPages : 0}
            initialPurchaseStatus={purchaseStatus}
          />

          {/* Related Products */}
          <RelatedProducts 
            currentProductId={product.id} 
            initialProducts={relatedProducts}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
