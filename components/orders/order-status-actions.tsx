"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Truck, Package } from "lucide-react"

interface OrderStatusActionsProps {
  status: string
  orderId: string
}

export function OrderStatusActions({ status, orderId }: OrderStatusActionsProps) {
  const handleConfirm = () => {
    console.log("[v0] Confirming order:", orderId)
    // Handle order confirmation
  }

  const handleCancel = () => {
    console.log("[v0] Cancelling order:", orderId)
    // Handle order cancellation
  }

  const handleShip = () => {
    console.log("[v0] Shipping order:", orderId)
    // Handle shipping
  }

  const handleComplete = () => {
    console.log("[v0] Completing order:", orderId)
    // Handle completion
  }

  if (status === "pending") {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Đơn hàng chờ xác nhận</h3>
              <p className="text-sm text-muted-foreground">Vui lòng xác nhận hoặc hủy đơn hàng này</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <XCircle className="h-4 w-4 mr-2" />
                Hủy đơn
              </Button>
              <Button onClick={handleConfirm}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Xác nhận
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "processing") {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Đơn hàng đang xử lý</h3>
              <p className="text-sm text-muted-foreground">Chuẩn bị hàng và giao cho đơn vị vận chuyển</p>
            </div>
            <Button onClick={handleShip}>
              <Truck className="h-4 w-4 mr-2" />
              Giao cho shipper
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "shipping") {
    return (
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Đơn hàng đang giao</h3>
              <p className="text-sm text-muted-foreground">Đơn hàng đang được vận chuyển đến khách hàng</p>
            </div>
            <Button onClick={handleComplete}>
              <Package className="h-4 w-4 mr-2" />
              Xác nhận đã giao
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "completed") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Đơn hàng đã hoàn thành</h3>
              <p className="text-sm text-muted-foreground">Đơn hàng đã được giao thành công</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
