"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product/product-card"
import { useFeaturedProducts } from "@/hooks/useProducts"
import { promotionsApi, Promotion } from "@/lib/api/promotions"
import { Clock } from "lucide-react"
import { Product } from "@/lib/api/products"

export default function FlashSalesPage() {
  const { products, loading } = useFeaturedProducts(0, 12)
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Fetch active promotion
    promotionsApi.getActive(0, 1).then((response) => {
      if (response.success && response.data?.content && response.data.content.length > 0) {
        setPromotion(response.data.content[0])
      }
    })
  }, [])

  useEffect(() => {
    if (!promotion) return

    const calculateTimeLeft = () => {
      const endDate = new Date(promotion.endDate)
      const now = new Date()
      const diff = endDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [promotion])

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
        <h1 className="mb-4 text-center text-3xl font-bold">Flash Sale</h1>
        {promotion && (
          <div className="mb-2 text-center text-sm opacity-90">
            {promotion.name}
          </div>
        )}
        <div className="flex items-center justify-center gap-2 text-lg">
          <Clock className="h-6 w-6" />
          <span>Kết thúc trong:</span>
          <div className="flex gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-white text-xl font-bold text-primary">
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
            <span className="text-2xl">:</span>
            <div className="flex h-12 w-12 items-center justify-center rounded bg-white text-xl font-bold text-primary">
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
            <span className="text-2xl">:</span>
            <div className="flex h-12 w-12 items-center justify-center rounded bg-white text-xl font-bold text-primary">
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải sản phẩm flash sale...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Không có sản phẩm flash sale
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={transformProduct(product)} />
          ))}
        </div>
      )}
    </div>
  )
}
