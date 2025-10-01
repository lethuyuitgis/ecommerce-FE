"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { featuredProducts } from "@/lib/products"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 34,
    seconds: 56,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const flashSaleProducts = featuredProducts.slice(0, 6)

  return (
    <section className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-primary">FLASH SALE</h2>
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
          </div>
          <Link
            href="/flash-sale"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
          >
            Xem tất cả
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
