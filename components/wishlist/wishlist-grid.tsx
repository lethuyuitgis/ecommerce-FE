"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/api/products"
import { wishlistApi } from "@/lib/api/wishlist"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getImageUrl } from "@/lib/utils/image"

interface WishlistGridProps {
  initialItems: Product[]
}

export function WishlistGrid({ initialItems }: WishlistGridProps) {
  const [items, setItems] = useState<Product[]>(initialItems)
  const [removing, setRemoving] = useState<string | null>(null)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleRemove = async (productId: string) => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    setRemoving(productId)
    try {
      const res = await wishlistApi.removeFromWishlist(productId)
      if (res.success) {
        setItems((prev) => prev.filter((p) => p.id !== productId))
        toast.success("Đã xoá khỏi danh sách yêu thích")
      } else {
        toast.error(res.message || "Không xoá được")
      }
    } catch (e) {
      toast.error("Đã xảy ra lỗi")
    } finally {
      setRemoving(null)
    }
  }

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    try {
      await addToCart(productId, null, 1)
      toast.success("Đã thêm vào giỏ hàng")
    } catch {
      toast.error("Không thêm được vào giỏ")
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-16">
        <Heart className="mb-3 h-16 w-16 text-muted-foreground/40" />
        <p className="text-lg font-medium text-foreground">Danh sách yêu thích trống</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Hãy duyệt sản phẩm và bấm trái tim để thêm vào đây.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Khám phá sản phẩm</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((product) => (
        <Card key={product.id} className="group overflow-hidden">
          <Link href={`/product/${product.id}`} className="block">
            <div className="relative aspect-square bg-muted">
              <Image
                src={getImageUrl(product.imageUrl) || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
          </Link>
          <CardContent className="space-y-2 p-3">
            <Link href={`/product/${product.id}`}>
              <h3 className="line-clamp-2 text-sm font-medium hover:text-primary">
                {product.name}
              </h3>
            </Link>
            <p className="text-base font-bold text-primary">{formatPrice(product.price)}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleAddToCart(product.id)}
              >
                <ShoppingCart className="mr-1 h-4 w-4" />
                Thêm
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleRemove(product.id)}
                disabled={removing === product.id}
              >
                {removing === product.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
