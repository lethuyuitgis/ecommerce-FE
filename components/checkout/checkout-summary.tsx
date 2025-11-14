"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/hooks/useCart"
import { useEffect, useMemo, useState } from "react"
import { promotionsApi, Promotion } from "@/lib/api/promotions"
import { vouchersApi, Voucher, ValidateVoucherResponse } from "@/lib/api/vouchers"
import { toast } from "sonner"
import { X, Tag, Check } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CheckoutSummaryProps {
  onSubmit: () => void
  loading?: boolean
  onVoucherChange?: (voucherCode: string | null, discountAmount: number) => void
}

export function CheckoutSummary({ onSubmit, loading = false, onVoucherChange }: CheckoutSummaryProps) {
  const { cartItems } = useCart()
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([])
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([])
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [voucherCode, setVoucherCode] = useState("")
  const [voucherDiscount, setVoucherDiscount] = useState(0)
  const [validatingVoucher, setValidatingVoucher] = useState(false)
  const [showVoucherPopover, setShowVoucherPopover] = useState(false)

  useEffect(() => {
    let mounted = true
    promotionsApi.getActive(0, 20).then((resp) => {
      if (mounted && resp.success && resp.data) {
        setActivePromotions(resp.data.content || [])
      }
    }).catch(() => { })
    return () => { mounted = false }
  }, [])

  // Calculate subtotal from cartItems to ensure accuracy
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.variantPrice || item.productPrice || 0
      return sum + (price * item.quantity)
    }, 0)
  }, [cartItems])

  useEffect(() => {
    let mounted = true
    const fetchVouchers = async () => {
      try {
        const resp = await vouchersApi.getAvailable(subtotal)
        if (mounted && resp.success && resp.data) {
          setAvailableVouchers(resp.data)
        }
      } catch (error) {
        console.error('Failed to fetch vouchers:', error)
      }
    }
    fetchVouchers()
    return () => { mounted = false }
  }, [subtotal])

  const computedPromotionDiscount = useMemo(() => {
    if (!activePromotions.length) return 0
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
  }, [activePromotions, subtotal])

  const handleValidateVoucher = async (code: string) => {
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã giảm giá")
      return
    }

    try {
      setValidatingVoucher(true)
      const response = await vouchersApi.validate({
        code: code.trim().toUpperCase(),
        subtotal,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })

      if (response.success && response.data) {
        if (response.data.valid && response.data.voucher) {
          setSelectedVoucher(response.data.voucher)
          setVoucherDiscount(response.data.discountAmount)
          setVoucherCode(code.trim().toUpperCase())
          setShowVoucherPopover(false)
          toast.success("Áp dụng mã giảm giá thành công!")
          onVoucherChange?.(response.data.voucher.code, response.data.discountAmount)
        } else {
          toast.error(response.data.message || "Mã giảm giá không hợp lệ")
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể kiểm tra mã giảm giá")
    } finally {
      setValidatingVoucher(false)
    }
  }

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null)
    setVoucherCode("")
    setVoucherDiscount(0)
    onVoucherChange?.(null, 0)
  }

  const shipping = 30000
  const promotionDiscount = computedPromotionDiscount
  const discount = promotionDiscount + voucherDiscount
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

      {/* Voucher Section */}
      <div className="mb-4 space-y-2">
        {selectedVoucher ? (
          <div className="flex items-center justify-between rounded-lg border border-primary bg-primary/5 p-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-medium text-primary">{selectedVoucher.code}</div>
                <div className="text-xs text-muted-foreground">{selectedVoucher.name}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveVoucher}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Popover open={showVoucherPopover} onOpenChange={setShowVoucherPopover}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Tag className="h-4 w-4" />
                Nhập mã giảm giá
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="start">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="voucher-code">Mã giảm giá</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="voucher-code"
                      placeholder="Nhập mã giảm giá"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleValidateVoucher(voucherCode)
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleValidateVoucher(voucherCode)}
                      disabled={validatingVoucher || !voucherCode.trim()}
                      size="sm"
                    >
                      {validatingVoucher ? "..." : "Áp dụng"}
                    </Button>
                  </div>
                </div>
                {availableVouchers.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Mã có thể sử dụng:</Label>
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                      {availableVouchers.map((voucher) => (
                        <div
                          key={voucher.id}
                          className="flex items-center justify-between rounded border p-2 cursor-pointer hover:bg-accent"
                          onClick={() => {
                            setVoucherCode(voucher.code)
                            handleValidateVoucher(voucher.code)
                          }}
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium">{voucher.code}</div>
                            <div className="text-xs text-muted-foreground">{voucher.name}</div>
                            {voucher.minPurchaseAmount && (
                              <div className="text-xs text-muted-foreground">
                                Đơn tối thiểu: ₫{voucher.minPurchaseAmount.toLocaleString("vi-VN")}
                              </div>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-primary">
                            {voucher.discountType === 'PERCENTAGE' || voucher.discountType === 'PERCENT'
                              ? `-${voucher.discountValue}%`
                              : `-₫${voucher.discountValue.toLocaleString("vi-VN")}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
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
        {promotionDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Khuyến mãi</span>
            <span className="text-primary">-₫{promotionDiscount.toLocaleString("vi-VN")}</span>
          </div>
        )}
        {voucherDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mã giảm giá</span>
            <span className="text-primary">-₫{voucherDiscount.toLocaleString("vi-VN")}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng giảm giá</span>
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
