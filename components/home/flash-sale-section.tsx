"use client"

import { useState, useEffect, useMemo } from "react"
import { ProductCard } from "@/components/product/product-card"
import { useFlashSaleProducts } from "@/hooks/useProducts"
import { Product } from "@/lib/api/products"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface FlashSaleSectionProps {
  initialProducts?: Product[]
}

function computeTimeLeft(endDate?: string): { hours: number; minutes: number; seconds: number } {
  if (!endDate) return { hours: 0, minutes: 0, seconds: 0 }
  const diff = Math.max(0, new Date(endDate).getTime() - Date.now())
  const totalSeconds = Math.floor(diff / 1000)
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

export function FlashSaleSection({ initialProducts = [] }: FlashSaleSectionProps) {
  // Use local state instead of hook if initial data is provided
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(initialProducts.length === 0)

  const { products: fetchedProducts, loading: fetchLoading } = useFlashSaleProducts(
    0, 6, { enabled: initialProducts.length === 0 }
  )

  useEffect(() => {
    if (initialProducts.length === 0 && !fetchLoading) {
      setProducts(fetchedProducts)
      setLoading(false)
    }
  }, [fetchedProducts, fetchLoading, initialProducts.length])

  // Pick the soonest flashSaleEnd from the loaded products
  const flashSaleEnd = useMemo(() => {
    const allProducts = products.length > 0 ? products : fetchedProducts
    const ends = allProducts
      .map((p) => (p as any).flashSaleEnd as string | undefined)
      .filter(Boolean) as string[]
    if (ends.length === 0) return undefined
    return ends.reduce((earliest, d) =>
      new Date(d) < new Date(earliest) ? d : earliest
    )
  }, [products, fetchedProducts])

  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(flashSaleEnd))

  // Re-sync when flashSaleEnd becomes available
  useEffect(() => {
    setTimeLeft(computeTimeLeft(flashSaleEnd))
  }, [flashSaleEnd])

  // Countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(computeTimeLeft(flashSaleEnd))
    }, 1000)
    return () => clearInterval(timer)
  }, [flashSaleEnd])

  const hasEnded = flashSaleEnd && new Date(flashSaleEnd) <= new Date()

  return (
    <section className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-primary">FLASH SALE</h2>
            {hasEnded ? (
              <span className="text-sm text-gray-500">Đã kết thúc</span>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-foreground text-sm font-bold text-background">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <span className="text-xl font-bold">:</span>
                <div className="flex h-9 w-9 items-center justify-center rounded bg-foreground text-sm font-bold text-background">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <span className="text-xl font-bold">:</span>
                <div className="flex h-9 w-9 items-center justify-center rounded bg-foreground text-sm font-bold text-background">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
              </div>
            )}
          </div>
          <Link
            href="/flash-sales"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
          >
            Xem tất cả
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-4">Đang tải sản phẩm flash sale...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
