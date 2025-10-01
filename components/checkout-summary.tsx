"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const orderItems = [
  {
    id: "1",
    name: "Áo Thun Nam Cotton Cao Cấp",
    image: "/placeholder.svg?height=60&width=60",
    price: 129000,
    quantity: 2,
    size: "M",
    color: "Trắng",
  },
  {
    id: "2",
    name: "Quần Jean Nam Slim Fit",
    image: "/placeholder.svg?height=60&width=60",
    price: 299000,
    quantity: 1,
    size: "L",
    color: "Xanh",
  },
  {
    id: "3",
    name: "Giày Sneaker Thể Thao",
    image: "/placeholder.svg?height=60&width=60",
    price: 450000,
    quantity: 1,
    size: "42",
    color: "Đen",
  },
]

export function CheckoutSummary() {
  const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 30000
  const discount = 0
  const total = subtotal + shipping - discount

  return (
    <div className="sticky top-4 rounded-lg bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Đơn Hàng ({orderItems.length} sản phẩm)</h2>

      {/* Order Items */}
      <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
        {orderItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
              <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground line-clamp-2">{item.name}</h4>
              <p className="text-xs text-muted-foreground">
                {item.color}, {item.size}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                ₫{(item.price * item.quantity).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        ))}
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

      <Button className="mt-6 w-full bg-primary hover:bg-primary/90" size="lg">
        Đặt Hàng
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
