"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/useCart"
import { useEffect, useMemo, useState } from "react"
import { promotionsApi, Promotion } from "@/lib/api/promotions"

interface CheckoutSummaryProps {
  onSubmit: () => void
  loading?: boolean
}

export function CheckoutSummary({ onSubmit, loading = false }: CheckoutSummaryProps) {
  const { cartItems, totalPrice } = useCart()
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([])

  useEffect(() => {
    let mounted = true
    promotionsApi.getActive(0, 20).then((resp) => {
      if (mounted && resp.success && resp.data) {
        setActivePromotions(resp.data.content || [])
      }
    }).catch(() => { })
    return () => { mounted = false }
  }, [])

  const computedDiscount = useMemo(() => {
    if (!activePromotions.length) return 0
    const subtotal = totalPrice
    // Chọn promo mang lại giảm giá cao nhất và thỏa minPurchaseAmount
    let best = 0
    activePromotions.forEach(p => {
      if (p.minPurchaseAmount && subtotal < p.minPurchaseAmount) return
      let d = 0
      const type = (p.promotionType || '').toUpperCase()
      if (type === 'PERCENTAGE' || type === 'PERCENT' || type === 'PERCENTAGE_DISCOUNT') {
        d = Math.floor(subtotal * (p.discountValue || 0) / 100)
      } else {
        d = Math.floor(p.discountValue || 0)
      }
      if (p.maxDiscountAmount && d > p.maxDiscountAmount) d = p.maxDiscountAmount
      if (d > best) best = d
    })
    return best
  }, [activePromotions, totalPrice])

  const shipping = 30000
  const discount = computedDiscount
  const subtotal = totalPrice
  const total = subtotal + shipping - discount

  return (
    <div className="sticky top-4 rounded-lg bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Đơn Hàng ({cartItems.length} sản phẩm)</h2>

      {/* Order Items */}
      <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
        {cartItems.map((item) => {
          const price = item.variantPrice || item.productPrice
          return (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border">
                <img src={item.productImage || "/placeholder.svg"} alt={item.productName} className="h-full w-full object-cover" />
                <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground line-clamp-2">{item.productName}</h4>
                {item.variantName && (
                  <p className="text-xs text-muted-foreground">
                    {item.variantName}
                  </p>
                )}
                <p className="mt-1 text-sm font-semibold text-foreground">
                  ₫{(price * item.quantity).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <Separator className="my-4" />

      {/* Summary */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="text-foreground">₫{subtotal.toLocaleString("vi-VN")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span className="text-foreground">₫{shipping.toLocaleString("vi-VN")}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Giảm giá</span>
            <span className="text-primary">-₫{discount.toLocaleString("vi-VN")}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-base">
          <span className="font-semibold text-foreground">Tổng cộng</span>
          <span className="text-2xl font-bold text-primary">₫{total.toLocaleString("vi-VN")}</span>
        </div>
      </div>

      <Button
        className="mt-6 w-full bg-primary hover:bg-primary/90"
        size="lg"
        onClick={onSubmit}
        disabled={loading || cartItems.length === 0}
      >
        {loading ? "Đang xử lý..." : "Đặt Hàng"}
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{" "}
        <a href="#" className="text-primary hover:underline">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="text-primary hover:underline">
          Chính sách bảo mật
        </a>
      </p>
    </div>
  )
}
