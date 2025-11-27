"use client"

import { AdminShipmentDTO } from "@/lib/api/shipper"
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
import { Eye, Truck, CheckCircle, XCircle, Clock, Package } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface ShipmentsTableProps {
  shipments: AdminShipmentDTO[]
  onViewDetail: (shipmentId: string) => void
  onUpdateStatus: (shipmentId: string) => void
  loading?: boolean
}

export function ShipmentsTable({
  shipments,
  onViewDetail,
  onUpdateStatus,
  loading = false,
}: ShipmentsTableProps) {
  const getStatusVariant = (status: string) => {
    const statusUpper = status.toUpperCase()
    if (statusUpper.includes("PENDING") || statusUpper.includes("READY_FOR_PICKUP")) {
      return "secondary"
    }
    if (statusUpper.includes("PICKED_UP")) {
      return "default"
    }
    if (statusUpper.includes("IN_TRANSIT")) {
      return "default"
    }
    if (statusUpper.includes("OUT_FOR_DELIVERY")) {
      return "default"
    }
    if (statusUpper.includes("DELIVERED")) {
      return "default"
    }
    if (statusUpper.includes("FAILED")) {
      return "destructive"
    }
    return "secondary"
  }

  const getStatusLabel = (status: string) => {
    const statusUpper = status.toUpperCase()
    if (statusUpper.includes("PENDING")) return "Chờ lấy hàng"
    if (statusUpper.includes("READY_FOR_PICKUP")) return "Sẵn sàng lấy hàng"
    if (statusUpper.includes("PICKED_UP")) return "Đã lấy hàng"
    if (statusUpper.includes("IN_TRANSIT")) return "Đang vận chuyển"
    if (statusUpper.includes("OUT_FOR_DELIVERY")) return "Đang giao hàng"
    if (statusUpper.includes("DELIVERED")) return "Đã giao hàng"
    if (statusUpper.includes("FAILED")) return "Giao hàng thất bại"
    if (statusUpper.includes("RETURNED")) return "Đã trả hàng"
    return status
  }

  const getStatusIcon = (status: string) => {
    const statusUpper = status.toUpperCase()
    if (statusUpper.includes("PENDING") || statusUpper.includes("READY_FOR_PICKUP")) {
      return <Clock className="h-4 w-4" />
    }
    if (statusUpper.includes("PICKED_UP") || statusUpper.includes("IN_TRANSIT") || statusUpper.includes("OUT_FOR_DELIVERY")) {
      return <Truck className="h-4 w-4" />
    }
    if (statusUpper.includes("DELIVERED")) {
      return <CheckCircle className="h-4 w-4" />
    }
    if (statusUpper.includes("FAILED")) {
      return <XCircle className="h-4 w-4" />
    }
    return <Package className="h-4 w-4" />
  }

  const canUpdateStatus = (shipment: AdminShipmentDTO) => {
    const statusUpper = shipment.status.toUpperCase()
    return (
      statusUpper.includes("PENDING") ||
      statusUpper.includes("READY_FOR_PICKUP") ||
      statusUpper.includes("PICKED_UP") ||
      statusUpper.includes("IN_TRANSIT") ||
      statusUpper.includes("OUT_FOR_DELIVERY")
    )
  }

  const formatAddress = (address?: { name?: string; address?: string; province?: string; district?: string; ward?: string }) => {
    if (!address) return "N/A"
    const parts = []
    if (address.address) parts.push(address.address)
    if (address.ward) parts.push(address.ward)
    if (address.district) parts.push(address.district)
    if (address.province) parts.push(address.province)
    return parts.length > 0 ? parts.join(", ") : "N/A"
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    )
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Chưa có đơn hàng nào được điều phối</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã vận đơn</TableHead>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Người nhận</TableHead>
            <TableHead>Địa chỉ giao hàng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>COD</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell className="font-medium">
                {shipment.trackingNumber || shipment.id.substring(0, 8)}
              </TableCell>
              <TableCell className="font-medium">
                {shipment.orderId ? shipment.orderId.substring(0, 8) : "N/A"}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {shipment.deliveryAddress?.name || "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {shipment.deliveryAddress?.phone || ""}
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={formatAddress(shipment.deliveryAddress)}>
                  {formatAddress(shipment.deliveryAddress)}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(shipment.status)} className="flex items-center gap-1 w-fit">
                  {getStatusIcon(shipment.status)}
                  {getStatusLabel(shipment.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {shipment.codAmount ? `₫${shipment.codAmount.toLocaleString("vi-VN")}` : "N/A"}
              </TableCell>
              <TableCell>
                {shipment.createdAt
                  ? format(new Date(shipment.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(shipment.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Chi tiết
                  </Button>
                  {canUpdateStatus(shipment) && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onUpdateStatus(shipment.id)}
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




