import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { FlashSalesClient } from "./flash-sales-client"
import { serverProductsApi, serverPromotionsApi } from "@/lib/api/server"
import { Product } from "@/lib/api/products"
import { Promotion } from "@/lib/api/promotions"

export default async function FlashSalesPage() {
  // Fetch featured products and active promotion on server
  let products: Product[] = []
  let promotion: Promotion | null = null

  try {
    const [productsResponse, promotionResponse] = await Promise.all([
      serverProductsApi.getFlashSales(),
      serverPromotionsApi.getActive(0, 1),
    ])

    // Backend returns ProductPage with content array
    if (productsResponse.success && productsResponse.data) {
      products = Array.isArray(productsResponse.data) 
        ? productsResponse.data 
        : (productsResponse.data.content || [])
    }

    if (promotionResponse.success && 
        promotionResponse.data?.content && 
        promotionResponse.data.content.length > 0) {
      promotion = promotionResponse.data.content[0]
    }
  } catch (error) {
    console.error('Error fetching flash sales data:', error)
    // Continue with empty data if fetch fails
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <FlashSalesClient initialProducts={products} initialPromotion={promotion} />
      </main>
      <Footer />
    </div>
  )
}
