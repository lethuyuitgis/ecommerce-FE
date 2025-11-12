"use client"

import { useState } from "react"
import { Star, MapPin, ShoppingCart, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Product } from "@/lib/products"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [showAddButton, setShowAddButton] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push('/login')
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

  return (
    <Link href={`/product/${product.id}`}>
      <Card
        className="group relative overflow-hidden transition-shadow hover:shadow-lg !py-0"
        onMouseEnter={() => setShowAddButton(true)}
        onMouseLeave={() => setShowAddButton(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {product.discount && (
            <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground">-{product.discount}%</Badge>
          )}
          {product.freeShip && (
            <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground">Freeship</Badge>
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
          <h3 className="mb-2 line-clamp-2 text-sm leading-tight text-foreground">{product.name}</h3>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-primary">₫{product.price.toLocaleString("vi-VN")}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₫{product.originalPrice.toLocaleString("vi-VN")}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
              <span className="mx-1">|</span>
              <span>Đã bán {product.sold}</span>
            </div>
          </div>
          {product.location && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{product.location}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
