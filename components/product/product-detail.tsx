"use client"

import { useState, useEffect, startTransition } from "react"
import { Star, Plus, Minus, ShoppingCart, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/contexts/AuthContext"
import { useWishlist } from "@/hooks/useWishlist"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product } from "@/lib/products"
import { ChatWithShopButton } from "./chat-with-shop-button"
import { useRouteLoading } from "@/contexts/RouteLoadingContext"

interface ProductDetailProps {
  product: Product
  sellerId?: string
  sellerName?: string
  variants?: {
    sizes?: string[]
    colors?: string[]
  }
  onProductUpdate?: () => void
}

export function ProductDetail({ product, sellerId, sellerName, variants, onProductUpdate }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const router = useRouter()
  const { startNavigation } = useRouteLoading()
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    const checkWishlist = async () => {
      if (isAuthenticated) {
        const result = await isInWishlist(product.id)
        setInWishlist(result)
      }
    }
    checkWishlist()
  }, [product.id, isAuthenticated, isInWishlist])

  // Initialize selected size and color from variants
  useEffect(() => {
    if (variants?.sizes && variants.sizes.length > 0 && !selectedSize) {
      setSelectedSize(variants.sizes[0])
    }
    if (variants?.colors && variants.colors.length > 0 && !selectedColor) {
      setSelectedColor(variants.colors[0])
    }
  }, [variants, selectedSize, selectedColor])

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image].filter(Boolean)
  
  const sizes = variants?.sizes || []
  const colors = variants?.colors || []

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      startNavigation("/login")
      startTransition(() => {
        router.push('/login')
      })
      return
    }

    // Validate variants if required
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Vui lòng chọn kích thước")
      return
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error("Vui lòng chọn màu sắc")
      return
    }

    try {
      await addToCart(product.id, null, quantity, {
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      })
      toast.success("Đã thêm vào giỏ hàng!")
      // Refresh product to update quantity
      onProductUpdate?.()
    } catch (error: any) {
      toast.error(error.message || "Thêm vào giỏ hàng thất bại")
    }
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      startNavigation("/login")
      startTransition(() => {
        router.push('/login')
      })
      return
    }

    // Validate variants if required
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Vui lòng chọn kích thước")
      return
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error("Vui lòng chọn màu sắc")
      return
    }

    try {
      await addToCart(product.id, null, quantity, {
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      })
      // Refresh product to update quantity before navigating
      onProductUpdate?.()
      startNavigation("/checkout")
      startTransition(() => {
        router.push('/checkout')
      })
    } catch (error: any) {
      toast.error(error.message || "Thêm vào giỏ hàng thất bại")
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    if (quantity < 99) setQuantity(quantity + 1)
  }

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {product.discount && (
              <Badge className="absolute left-4 top-4 bg-secondary text-secondary-foreground">
                -{product.discount}%
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-primary">
              Yêu thích
            </Badge>
            <span className="text-sm text-muted-foreground">Đã bán {product.sold}</span>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-foreground">{product.name}</h1>

          {/* Rating */}
          <div className="mb-4 flex items-center gap-4 border-b pb-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold text-primary">{product.rating}</span>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <span className="text-lg font-semibold">{product.sold}</span>
              <span className="ml-1 text-sm text-muted-foreground">Đánh Giá</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <span className="text-lg font-semibold">{product.sold}</span>
              <span className="ml-1 text-sm text-muted-foreground">Đã Bán</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6 rounded-lg bg-muted/50 p-4">
            <div className="flex items-baseline gap-3">
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₫{product.originalPrice.toLocaleString("vi-VN")}
                </span>
              )}
              <span className="text-3xl font-bold text-primary">₫{product.price.toLocaleString("vi-VN")}</span>
              {product.discount && (
                <Badge className="bg-secondary text-secondary-foreground">-{product.discount}%</Badge>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Kích Thước</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 min-w-16 rounded-sm border px-4 text-sm font-medium transition-colors ${selectedSize === size
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-foreground hover:border-primary"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Màu Sắc</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 min-w-20 rounded-sm border px-4 text-sm font-medium transition-colors ${selectedColor === color
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-foreground hover:border-primary"
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">Số Lượng</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-sm border">
                <button
                  onClick={decreaseQuantity}
                  className="flex h-10 w-10 items-center justify-center border-r hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = Number.parseInt(e.target.value) || 1
                    setQuantity(Math.max(1, Math.min(99, val)))
                  }}
                  className="h-10 w-16 border-0 text-center focus:outline-none"
                />
                <button
                  onClick={increaseQuantity}
                  className="flex h-10 w-10 items-center justify-center border-l hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                Còn {product.quantity || 0} sản phẩm
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-primary text-primary hover:bg-primary/5 bg-transparent"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm Vào Giỏ
            </Button>
            <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleBuyNow}>
              Mua Ngay
            </Button>
          </div>

          {/* Chat with Shop */}
          {sellerId && (
            <div className="mt-4">
              <ChatWithShopButton
                sellerId={sellerId}
                sellerName={sellerName}
                productId={product.id}
                productName={product.name}
              />
            </div>
          )}

          {/* Additional Actions */}
          <div className="mt-4 flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 ${inWishlist ? "text-primary" : ""}`}
              onClick={async () => {
                if (!isAuthenticated) {
                  startNavigation("/login")
                  startTransition(() => {
                    router.push('/login')
                  })
                  return
                }
                try {
                  if (inWishlist) {
                    await removeFromWishlist(product.id)
                    setInWishlist(false)
                  } else {
                    await addToWishlist(product.id)
                    setInWishlist(true)
                  }
                } catch (error) {
                  // Error already handled in hook
                }
              }}
            >
              <Heart className={`mr-2 h-4 w-4 ${inWishlist ? "fill-primary" : ""}`} />
              {inWishlist ? "Đã Yêu Thích" : "Yêu Thích"}
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Chia Sẻ
            </Button>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 space-y-3 border-t pt-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Miễn phí vận chuyển</p>
                <p className="text-sm text-muted-foreground">Cho đơn hàng từ 50.000₫</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Đảm bảo chính hãng</p>
                <p className="text-sm text-muted-foreground">100% sản phẩm chính hãng</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-foreground">Đổi trả trong 7 ngày</p>
                <p className="text-sm text-muted-foreground">Nếu sản phẩm lỗi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
