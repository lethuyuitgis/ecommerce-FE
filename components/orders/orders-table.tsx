"use client"

import { useState, useEffect } from "react"
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
import { ordersApi, Order } from "@/lib/api/orders"
import { toast } from "sonner"

interface OrdersTableProps {
  status: string
}

export function OrdersTable({ status }: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState<{ orderId: string, action: 'CONFIRM' | 'CANCEL' | 'SHIP' } | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [status])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await ordersApi.getSellerOrders(0, 100, status)
      if (response.success && response.data) {
        setOrders(response.data.content || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error("Tải danh sách đơn hàng thất bại")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await ordersApi.updateOrderStatus(orderId, newStatus)
      if (response.success) {
        toast.success("Cập nhật trạng thái thành công")
        fetchOrders()
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật trạng thái thất bại")
    }
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((o) => o.id))
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
    const statusUpper = status.toUpperCase()
    switch (statusUpper) {
      case "PENDING":
        return <Badge variant="secondary">Chờ xác nhận</Badge>
      case "PROCESSING":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Đang xử lý</Badge>
      case "SHIPPING":
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Đang giao</Badge>
      case "DELIVERED":
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Hoàn thành</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      cod: "COD",
      transfer: "Chuyển khoản",
      momo: "MoMo",
      zalopay: "ZaloPay",
    }
    return methodMap[method.toLowerCase()] || method
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
                  checked={selectedOrders.length === orders.length && orders.length > 0}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Đang tải đơn hàng...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Không có đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => toggleSelect(order.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/seller/orders/${order.id}`} className="font-medium hover:text-primary">
                      {order.orderNumber || order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.customerId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.items?.length || 0} sản phẩm</TableCell>
                  <TableCell className="text-right font-medium">
                    ₫{(order.finalTotal || order.totalPrice || 0).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>{getPaymentMethodLabel(order.paymentMethod)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
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
                        {order.status === "PENDING" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setConfirm({ orderId: order.id, action: "CONFIRM" })}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Xác nhận đơn
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setConfirm({ orderId: order.id, action: "CANCEL" })}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Hủy đơn
                            </DropdownMenuItem>
                          </>
                        )}
                        {order.status === "PROCESSING" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setConfirm({ orderId: order.id, action: "SHIP" })}>
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
      <AlertDialog open={!!confirm} onOpenChange={(open) => { if (!open) setConfirm(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.action === 'CONFIRM' ? 'Xác nhận đơn hàng?' :
                confirm?.action === 'CANCEL' ? 'Hủy đơn hàng?' :
                  'Giao cho shipper?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động sẽ cập nhật trạng thái đơn hàng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Hủy</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={async () => {
                  if (!confirm) return
                  const { orderId, action } = confirm
                  setConfirm(null)
                  await handleUpdateStatus(orderId,
                    action === 'CONFIRM' ? 'PROCESSING' :
                      action === 'CANCEL' ? 'CANCELLED' : 'SHIPPING'
                  )
                }}
              >
                Xác nhận
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
