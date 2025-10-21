"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Printer, CheckCircle, XCircle, Truck } from "lucide-react"

const mockOrders = [
  {
    id: "DH001234",
    customer: "Nguyễn Văn A",
    phone: "0901234567",
    products: 3,
    total: 31500000,
    status: "pending",
    date: "2024-01-07 14:30",
    payment: "COD",
  },
  {
    id: "DH001233",
    customer: "Trần Thị B",
    phone: "0912345678",
    products: 1,
    total: 29990000,
    status: "processing",
    date: "2024-01-07 10:15",
    payment: "Chuyển khoản",
  },
  {
    id: "DH001232",
    customer: "Lê Văn C",
    phone: "0923456789",
    products: 2,
    total: 750000,
    status: "shipping",
    date: "2024-01-06 16:20",
    payment: "COD",
  },
  {
    id: "DH001231",
    customer: "Phạm Thị D",
    phone: "0934567890",
    products: 5,
    total: 2450000,
    status: "completed",
    date: "2024-01-06 09:45",
    payment: "Chuyển khoản",
  },
  {
    id: "DH001230",
    customer: "Hoàng Văn E",
    phone: "0945678901",
    products: 1,
    total: 350000,
    status: "cancelled",
    date: "2024-01-05 11:00",
    payment: "COD",
  },
]

interface OrdersTableProps {
  status: string
}

export function OrdersTable({ status }: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const filteredOrders = status === "all" ? mockOrders : mockOrders.filter((order) => order.status === status)

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedOrders((prev) => (prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Chờ xác nhận</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Đang xử lý</Badge>
      case "shipping":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Đang giao</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Hoàn thành</Badge>
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-2 p-4 border-b bg-muted/50">
            <span className="text-sm text-muted-foreground">Đã chọn {selectedOrders.length} đơn hàng</span>
            <Button variant="outline" size="sm">
              In đơn hàng
            </Button>
            <Button variant="outline" size="sm">
              Xuất Excel
            </Button>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Không có đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => toggleSelect(order.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/seller/orders/${order.id}`} className="font-medium hover:text-primary">
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.products} sản phẩm</TableCell>
                  <TableCell className="text-right font-medium">{formatPrice(order.total)}</TableCell>
                  <TableCell>{order.payment}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/seller/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          In đơn hàng
                        </DropdownMenuItem>
                        {order.status === "pending" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Xác nhận đơn
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <XCircle className="h-4 w-4 mr-2" />
                              Hủy đơn
                            </DropdownMenuItem>
                          </>
                        )}
                        {order.status === "processing" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Truck className="h-4 w-4 mr-2" />
                              Giao cho shipper
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
