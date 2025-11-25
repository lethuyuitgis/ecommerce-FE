"use client"

import { useState, useMemo } from "react"
import { Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { CartItem as CartItemType } from "@/lib/api/cart"

interface CartSummaryProps {
  initialCartItems?: CartItemType[]
}

export function CartSummary({ initialCartItems = [] }: CartSummaryProps) {
  const { cartItems } = useCart()
  const [voucherCode, setVoucherCode] = useState("")

  // Use initial data from server if available, otherwise use context
  const displayItems = cartItems.length > 0 ? cartItems : initialCartItems

  // Calculate subtotal from cartItems
  const subtotal = useMemo(() => {
    return displayItems.reduce((sum, item) => {
      const price = item.variantPrice || item.productPrice || 0
      return sum + (price * item.quantity)
    }, 0)
  }, [displayItems])

  const shipping = 30000
  const discount = 0
  const total = subtotal + shipping - discount

  return (
    <div className="sticky top-4 space-y-4">
      {/* Voucher */}
      <div className="rounded-lg bg-white p-4">
        <h3 className="mb-3 font-semibold text-foreground">Mã Giảm Giá</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Nhập mã giảm giá"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">Áp Dụng</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-white p-4">
        <h3 className="mb-4 font-semibold text-foreground">Tóm Tắt Đơn Hàng</h3>
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
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Tổng cộng</span>
              <span className="text-2xl font-bold text-primary">₫{total.toLocaleString("vi-VN")}</span>
            </div>
          </div>
        </div>
        <Link href="/checkout">
          <Button className="mt-4 w-full bg-primary hover:bg-primary/90" size="lg">
            Mua Hàng
          </Button>
        </Link>
      </div>

      {/* Shipping Info */}
      <div className="rounded-lg bg-white p-4">
        <h3 className="mb-3 font-semibold text-foreground">Thông Tin Vận Chuyển</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Miễn phí vận chuyển cho đơn hàng từ 50.000₫</span>
          </div>
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Giao hàng trong 2-3 ngày</span>
          </div>
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Đổi trả trong 7 ngày nếu sản phẩm lỗi</span>
          </div>
        </div>
      </div>
    </div>
  )
}
