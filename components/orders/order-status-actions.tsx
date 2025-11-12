"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Truck, Package, Loader2 } from "lucide-react"
import { ordersApi } from "@/lib/api/orders"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface OrderStatusActionsProps {
  status: string
  orderId: string
  onStatusUpdate?: () => void
}

export function OrderStatusActions({ status, orderId, onStatusUpdate }: OrderStatusActionsProps) {
  const [loading, setLoading] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const updateStatus = async (newStatus: string) => {
    try {
      setLoading(true)
      const response = await ordersApi.updateOrderStatus(orderId, newStatus)
      if (response.success) {
        toast.success("Cập nhật trạng thái đơn hàng thành công")
        onStatusUpdate?.()
      } else {
        toast.error(response.message || "Cập nhật trạng thái thất bại")
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật trạng thái thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    updateStatus("PROCESSING")
  }

  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = () => {
    updateStatus("CANCELLED")
    setShowCancelDialog(false)
  }

  const handleShip = () => {
    updateStatus("SHIPPING")
  }

  const handleComplete = () => {
    updateStatus("DELIVERED")
  }

  if (status === "pending" || status === "PENDING") {
    return (
      <>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">Đơn hàng chờ xác nhận</h3>
                <p className="text-sm text-muted-foreground">Vui lòng xác nhận hoặc hủy đơn hàng này</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={loading}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Hủy đơn
                </Button>
                <Button onClick={handleConfirm} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Xác nhận
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Không</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Xác nhận hủy
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  if (status === "processing" || status === "PROCESSING") {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Đơn hàng đang xử lý</h3>
              <p className="text-sm text-muted-foreground">Chuẩn bị hàng và giao cho đơn vị vận chuyển</p>
            </div>
            <Button onClick={handleShip} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Truck className="h-4 w-4 mr-2" />
              )}
              Giao cho shipper
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "shipping" || status === "SHIPPING") {
    return (
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Đơn hàng đang giao</h3>
              <p className="text-sm text-muted-foreground">Đơn hàng đang được vận chuyển đến khách hàng</p>
            </div>
            <Button onClick={handleComplete} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Package className="h-4 w-4 mr-2" />
              )}
              Xác nhận đã giao
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "completed" || status === "delivered" || status === "DELIVERED") {
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

  if (status === "cancelled" || status === "CANCELLED") {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Đơn hàng đã hủy</h3>
              <p className="text-sm text-muted-foreground">Đơn hàng này đã bị hủy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
