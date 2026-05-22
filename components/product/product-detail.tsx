"use client"

import { useState, useEffect, startTransition, useMemo } from "react"
import { Star, Plus, Minus, ShoppingCart, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/contexts/AuthContext"
import { useWishlist } from "@/hooks/useWishlist"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product } from "@/lib/api/products"
import { ChatWithShopButton } from "./chat-with-shop-button"
import { useRouteLoading } from "@/contexts/RouteLoadingContext"
import { getImageUrl } from "@/lib/utils/image"
import Image from "next/image"

interface ProductDetailProps {
  product: Product
  sellerId?: string
  sellerName?: string
  variants?: {
    sizes?: string[]
    colors?: string[]
  }
  onProductUpdate?: () => void
  initialInWishlist?: boolean
}

export function ProductDetail({ product, sellerId, sellerName, variants, onProductUpdate, initialInWishlist = false }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { addToWishlist, removeFromWishlist } = useWishlist()
  const router = useRouter()
  const { startNavigation } = useRouteLoading()
  const [inWishlist, setInWishlist] = useState(initialInWishlist)

  // Find matching variant
  const selectedVariant = useMemo(() => {
    if (!product.productVariantDtos) return null
    return product.productVariantDtos.find(v => {
      // Logic to match variant by name or attributes
      // Simple heuristic: check if name contains size and color
      const name = v.variantName.toLowerCase()
      const hasSize = selectedSize ? name.includes(selectedSize.toLowerCase()) : true
      const hasColor = selectedColor ? name.includes(selectedColor.toLowerCase()) : true
      return hasSize && hasColor
    }) || null
  }, [product.productVariantDtos, selectedSize, selectedColor])

  // Initialize selected size and color from variants
  useEffect(() => {
    if (variants?.sizes && variants.sizes.length > 0 && !selectedSize) {
      setSelectedSize(variants.sizes[0])
    }
    if (variants?.colors && variants.colors.length > 0 && !selectedColor) {
      setSelectedColor(variants.colors[0])
    }
  }, [variants, selectedSize, selectedColor])

  const images = product.productImages && product.productImages.length > 0
    ? product.productImages.map(img => img.url || img.imageUrl || img.image_url).filter(Boolean) as string[]
    : (product.images && product.images.length > 0 
        ? product.images 
        : [product.primaryImage || product.imageUrl || '/placeholder.svg'].filter(Boolean) as string[])
  
  const sizes = variants?.sizes || []
  const colors = variants?.colors || []

  const currentPrice = selectedVariant?.variantPrice || product.price
  const currentQuantity = selectedVariant ? selectedVariant.variantQuantity : (product.quantity || 0)

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
      await addToCart(product.id, selectedVariant?.id || null, quantity, {
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      })
      toast.success("Đã thêm vào giỏ hàng!")
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
      await addToCart(product.id, selectedVariant?.id || null, quantity, {
        size: selectedSize || undefined,
        color: selectedColor || undefined,
      })
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
    if (quantity < currentQuantity) setQuantity(quantity + 1)
    else toast.warning("Đã đạt số lượng tối đa có sẵn")
  }

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={getImageUrl(images[selectedImage])}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {product.flashSaleEnabled && (
              <Badge className="absolute left-4 top-4 bg-red-500 text-white">
                FLASH SALE
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {images.slice(0, 5).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 ${selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
              >
                <Image
                  src={getImageUrl(image)}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
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
            <span className="text-sm text-muted-foreground">Đã bán {product.totalSold || 0}</span>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-foreground">{product.name}</h1>

          {/* Rating */}
          <div className="mb-4 flex items-center gap-4 border-b pb-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold text-primary">{product.rating?.toFixed(1) || '0.0'}</span>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <span className="text-lg font-semibold">{product.totalReviews || 0}</span>
              <span className="ml-1 text-sm text-muted-foreground">Đánh Giá</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6 rounded-lg bg-muted/50 p-4">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-primary">
                ₫{currentPrice.toLocaleString("vi-VN")}
              </span>
              {product.comparePrice && product.comparePrice > currentPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₫{product.comparePrice.toLocaleString("vi-VN")}
                </span>
              )}
              {product.comparePrice && product.comparePrice > currentPrice && (
                <Badge className="bg-red-500 text-white text-base px-3 py-1">
                  -{Math.round(((product.comparePrice - currentPrice) / product.comparePrice) * 100)}%
                </Badge>
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
                    setQuantity(Math.max(1, Math.min(currentQuantity, val)))
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
                Còn {currentQuantity} sản phẩm {selectedVariant ? `biến thể` : ''}
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
              disabled={currentQuantity === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {currentQuantity === 0 ? "Hết hàng" : "Thêm Vào Giỏ"}
            </Button>
            <Button 
                size="lg" 
                className="flex-1 bg-primary hover:bg-primary/90" 
                onClick={handleBuyNow}
                disabled={currentQuantity === 0}
            >
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
                  // Error handled
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
        </div>
      </div>
    </div>
  )
}
