'use client'

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product/product-card"
import { promotionsApi, Promotion } from "@/lib/api/promotions"
import { Clock } from "lucide-react"
import { Product } from "@/lib/api/products"

interface FlashSalesClientProps {
  initialProducts: Product[]
  initialPromotion: Promotion | null
}

export function FlashSalesClient({ initialProducts, initialPromotion }: FlashSalesClientProps) {
  const [promotion, setPromotion] = useState<Promotion | null>(initialPromotion)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (!promotion) {
      // Fetch active promotion if not provided
      promotionsApi.getActive(0, 1).then((response) => {
        if (response.success && response.data?.content && response.data.content.length > 0) {
          setPromotion(response.data.content[0])
        }
      })
    }
  }, [promotion])

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
  const transformProduct = (product: Product) => {
    // Ưu tiên flashSalePrice nếu có, nếu không thì dùng price
    const salePrice = product.flashSaleEnabled && product.flashSalePrice 
      ? product.flashSalePrice 
      : product.price
    
    // Giá cũ: nếu có flashSalePrice thì dùng price, nếu không thì dùng comparePrice
    const originalPrice = product.flashSaleEnabled && product.flashSalePrice
      ? product.price
      : product.comparePrice
    
    return {
      id: product.id,
      name: product.name,
      price: salePrice,
      originalPrice: originalPrice,
      comparePrice: product.comparePrice,
      image: product.primaryImage || product.images?.[0] || '/placeholder.svg',
      rating: product.rating || 0,
      sold: product.totalSold || 0,
      discount: originalPrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : undefined,
      category: product.categoryName,
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {promotion && (
        <div className="mb-8 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{promotion.name}</h2>
              <p className="text-red-50">{promotion.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Còn lại:</span>
              <div className="flex gap-2">
                <div className="rounded bg-white/20 px-3 py-1 text-lg font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span>:</span>
                <div className="rounded bg-white/20 px-3 py-1 text-lg font-bold">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span>:</span>
                <div className="rounded bg-white/20 px-3 py-1 text-lg font-bold">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Flash Sale</h1>
        <p className="text-muted-foreground">Sản phẩm giảm giá sốc, nhanh tay đặt hàng!</p>
      </div>

      {initialProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không có sản phẩm flash sale</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {initialProducts.map((product) => (
            <ProductCard key={product.id} product={transformProduct(product)} />
          ))}
        </div>
      )}
    </div>
  )
}

