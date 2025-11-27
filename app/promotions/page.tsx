import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { PromotionsClient } from "./promotions-client"
import { serverPromotionsApi } from "@/lib/api/server"
import { Promotion } from "@/lib/api/promotions"

export default async function PromotionsPage() {
  // Fetch active promotions on server
  let promotions: Promotion[] = []

  try {
    const promotionResponse = await serverPromotionsApi.getActive(0, 20)

    if (promotionResponse.success && promotionResponse.data?.content) {
      promotions = promotionResponse.data.content
    }
  } catch (error) {
    console.error('Error fetching promotions:', error)
    // Continue with empty data if fetch fails
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <PromotionsClient initialPromotions={promotions} />
      </main>
      <Footer />
    </div>
  )
}




