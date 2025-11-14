"use client"

import { useState } from "react"
import { Order } from "@/lib/api/orders"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface ShipperOrdersTableProps {
  orders: Order[]
  onViewDetail: (orderId: string) => void
  onUpdateStatus: (orderId: string, status: string) => void
  loading?: boolean
}

export function ShipperOrdersTable({
  orders,
  onViewDetail,
  onUpdateStatus,
  loading = false,
}: ShipperOrdersTableProps) {
  const getStatusVariant = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes("pending") || statusLower.includes("chờ")) {
      return "secondary"
    }
    if (statusLower.includes("picked") || statusLower.includes("đã lấy")) {
      return "default"
    }
    if (statusLower.includes("transit") || statusLower.includes("vận chuyển")) {
      return "default"
    }
    if (statusLower.includes("delivery") || statusLower.includes("giao")) {
      return "default"
    }
    if (statusLower.includes("delivered") || statusLower.includes("đã giao")) {
      return "default"
    }
    if (statusLower.includes("failed") || statusLower.includes("thất bại")) {
      return "destructive"
    }
    return "secondary"
  }

  const getStatusLabel = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes("pending")) return "Chờ lấy hàng"
    if (statusLower.includes("picked")) return "Đã lấy hàng"
    if (statusLower.includes("transit")) return "Đang vận chuyển"
    if (statusLower.includes("delivery")) return "Đang giao hàng"
    if (statusLower.includes("delivered")) return "Đã giao hàng"
    if (statusLower.includes("failed")) return "Giao hàng thất bại"
    return status
  }

  const canUpdateStatus = (order: Order) => {
    const statusLower = order.shippingStatus?.toLowerCase() || ""
    return (
      statusLower.includes("pending") ||
      statusLower.includes("picked") ||
      statusLower.includes("transit") ||
      statusLower.includes("delivery")
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Chưa có đơn hàng nào</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Địa chỉ giao hàng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customerName}</div>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {order.items[0]?.productName || "N/A"}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.shippingStatus || order.status)}>
                  {getStatusLabel(order.shippingStatus || order.status)}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(order.finalTotal)}</TableCell>
              <TableCell>
                {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(order.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Chi tiết
                  </Button>
                  {canUpdateStatus(order) && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        const nextStatus = getNextStatus(order.shippingStatus || order.status)
                        onUpdateStatus(order.id, nextStatus)
                      }}
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      Cập nhật
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function getNextStatus(currentStatus: string): string {
  const statusLower = currentStatus.toLowerCase()
  if (statusLower.includes("pending")) return "PICKED_UP"
  if (statusLower.includes("picked")) return "IN_TRANSIT"
  if (statusLower.includes("transit")) return "OUT_FOR_DELIVERY"
  if (statusLower.includes("delivery")) return "DELIVERED"
  return "PICKED_UP"
}


