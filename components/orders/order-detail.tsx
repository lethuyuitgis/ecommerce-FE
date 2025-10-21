"use client"

import { Package, Truck, CheckCircle, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface OrderDetailProps {
  orderId: string
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  // Mock data - in real app, fetch from API
  const order = {
    id: orderId,
    orderNumber: "DH001234567",
    date: "2025-01-20",
    status: "shipping",
    total: 1037000,
    subtotal: 1007000,
    shipping: 30000,
    discount: 0,
    paymentMethod: "COD",
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0123456789",
      address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
    },
    items: [
      {
        id: "1",
        name: "Áo Thun Nam Cotton Cao Cấp",
        image: "/placeholder.svg?height=100&width=100",
        price: 129000,
        quantity: 2,
        size: "M",
        color: "Trắng",
      },
      {
        id: "2",
        name: "Quần Jean Nam Slim Fit",
        image: "/placeholder.svg?height=100&width=100",
        price: 299000,
        quantity: 1,
        size: "L",
        color: "Xanh",
      },
      {
        id: "3",
        name: "Giày Sneaker Thể Thao",
        image: "/placeholder.svg?height=100&width=100",
        price: 450000,
        quantity: 1,
        size: "42",
        color: "Đen",
      },
    ],
    timeline: [
      { status: "Đơn hàng đã đặt", date: "20/01/2025 10:30", completed: true },
      { status: "Đã xác nhận", date: "20/01/2025 11:00", completed: true },
      { status: "Đang đóng gói", date: "20/01/2025 14:00", completed: true },
      { status: "Đang giao hàng", date: "21/01/2025 08:00", completed: true },
      { status: "Đã giao hàng", date: "", completed: false },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">Chi Tiết Đơn Hàng</h1>
            <p className="text-sm text-muted-foreground">
              Mã đơn hàng: <span className="font-semibold text-foreground">{order.orderNumber}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Ngày đặt: {new Date(order.date).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            <Truck className="mr-1 h-3 w-3" />
            Đang giao hàng
          </Badge>
        </div>

        {/* Order Timeline */}
        <div className="relative mt-6">
          <div className="flex justify-between">
            {order.timeline.map((step, index) => (
              <div key={index} className="flex flex-1 flex-col items-center">
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                    step.completed ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.completed ? <CheckCircle className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                </div>
                <p
                  className={`text-center text-xs font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.status}
                </p>
                {step.date && <p className="text-center text-xs text-muted-foreground">{step.date}</p>}
                {index < order.timeline.length - 1 && (
                  <div
                    className={`absolute top-5 h-0.5 ${step.completed ? "bg-primary" : "bg-muted"}`}
                    style={{
                      left: `${(index / (order.timeline.length - 1)) * 100}%`,
                      width: `${100 / (order.timeline.length - 1)}%`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Sản Phẩm ({order.items.length})</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded border">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 font-medium text-foreground">{item.name}</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Phân loại: {item.color}, {item.size}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                      <p className="font-semibold text-foreground">₫{item.price.toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Info */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Địa Chỉ Nhận Hàng</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{order.shippingAddress.phone}</span>
              </div>
              <p className="text-muted-foreground">{order.shippingAddress.address}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-lg bg-white p-6">
            <h3 className="mb-3 font-semibold text-foreground">Phương Thức Thanh Toán</h3>
            <p className="text-sm text-muted-foreground">Thanh toán khi nhận hàng (COD)</p>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg bg-white p-6">
            <h3 className="mb-4 font-semibold text-foreground">Tóm Tắt Đơn Hàng</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="text-foreground">₫{order.subtotal.toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span className="text-foreground">₫{order.shipping.toLocaleString("vi-VN")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span className="text-primary">-₫{order.discount.toLocaleString("vi-VN")}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-foreground">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">₫{order.total.toLocaleString("vi-VN")}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full bg-transparent" variant="outline">
              Liên Hệ Người Bán
            </Button>
            <Link href="/orders">
              <Button className="w-full bg-transparent" variant="outline">
                Quay Lại Đơn Hàng
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
