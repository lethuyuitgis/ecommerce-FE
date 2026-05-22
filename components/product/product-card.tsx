"use client"

import { useState, startTransition } from "react"
import { Star, MapPin, ShoppingCart, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/api/products"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useRouteLoading } from "@/contexts/RouteLoadingContext"
import { getImageUrl } from "@/lib/utils/image"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { startNavigation } = useRouteLoading()
  const [adding, setAdding] = useState(false)
  const [showAddButton, setShowAddButton] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      startNavigation("/login")
      startTransition(() => {
        router.push('/login')
      })
      return
    }

    try {
      setAdding(true)
      await addToCart(product.id, null, 1)
      toast.success("Đã thêm vào giỏ hàng!")
    } catch (error: any) {
      toast.error(error.message || "Thêm vào giỏ hàng thất bại")
    } finally {
      setAdding(false)
    }
  }

  const productImage = product.primaryImage || product.imageUrl || (product.images && product.images.length > 0 ? product.images[0] : null) || (product as any).image || '/placeholder.svg'
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100) 
    : 0

  return (
    <Link href={`/product/${product.id}`} prefetch={false}>
      <Card
        className="group relative h-full overflow-hidden transition-shadow hover:shadow-lg !py-0"
        onMouseEnter={() => setShowAddButton(true)}
        onMouseLeave={() => setShowAddButton(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={getImageUrl(productImage)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
          {hasDiscount && (
            <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground">-{discountPercent}%</Badge>
          )}
          {/* Quick Add Button - Show on hover */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${showAddButton ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={(e) => e.preventDefault()}
          >
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={adding}
              className="bg-primary hover:bg-primary/90"
            >
              {adding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Thêm vào giỏ
                </>
              )}
            </Button>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-tight text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              ₫{product.price.toLocaleString("vi-VN")}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                ₫{product.comparePrice!.toLocaleString("vi-VN")}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{product.rating || 0}</span>
              <span className="mx-1">|</span>
              <span>Đã bán {product.totalSold || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
