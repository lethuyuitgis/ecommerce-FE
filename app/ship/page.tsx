"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { shipperApi } from "@/lib/api/shipper"
import { Order } from "@/lib/api/orders"
import { ShipperOrdersTable } from "@/components/shipper/shipper-orders-table"
import { UpdateShippingStatusDialog } from "@/components/shipper/update-shipping-status-dialog"
import { OrderDetail } from "@/components/orders/order-detail"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Search, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/format"

export default function ShipDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user && user.userType !== "SHIPPER") {
      toast.error("Bạn không có quyền truy cập trang này")
      router.push("/")
      return
    }

    if (user) {
      loadOrders()
    }
  }, [user, authLoading, statusFilter, page])

  const loadOrders = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await shipperApi.getOrdersToShip(page, 20, statusFilter)
      if (response.success && response.data) {
        setOrders(response.data.content || [])
        setTotalPages(response.data.totalPages || 0)
      } else {
        toast.error("Không thể tải danh sách đơn hàng")
      }
    } catch (error) {
      console.error("Error loading orders:", error)
      toast.error("Có lỗi xảy ra khi tải đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = async (orderId: string) => {
    try {
      const response = await shipperApi.getOrderDetail(orderId)
      if (response.success && response.data) {
        setSelectedOrder(response.data)
        setShowDetail(true)
      } else {
        toast.error("Không thể tải chi tiết đơn hàng")
      }
    } catch (error) {
      console.error("Error loading order detail:", error)
      toast.error("Có lỗi xảy ra")
    }
  }

  const handleUpdateStatus = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setUpdatingOrderId(orderId)
      setShowUpdateDialog(true)
    }
  }

  const handleStatusUpdate = async (
    status: string,
    location?: string,
    description?: string,
    failureReason?: string
  ) => {
    if (!updatingOrderId) return

    try {
      const response = await shipperApi.updateShippingStatus(updatingOrderId, {
        status,
        location,
        description,
        failureReason,
      })

      if (response.success) {
        toast.success("Cập nhật trạng thái thành công")
        setShowUpdateDialog(false)
        setUpdatingOrderId(null)
        loadOrders()
        if (showDetail && selectedOrder) {
          handleViewDetail(selectedOrder.id)
        }
      } else {
        toast.error("Không thể cập nhật trạng thái")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái")
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadOrders()
      return
    }

    setLoading(true)
    try {
      const response = await shipperApi.searchOrder(searchQuery)
      if (response.success && response.data) {
        setOrders(response.data)
      } else {
        toast.error("Không tìm thấy đơn hàng")
      }
    } catch (error) {
      console.error("Error searching:", error)
      toast.error("Có lỗi xảy ra khi tìm kiếm")
    } finally {
      setLoading(false)
    }
  }

  const getStatusStats = () => {
    const stats = {
      pending: orders.filter((o) => o.shippingStatus?.toLowerCase().includes("pending") || o.status?.toLowerCase().includes("pending")).length,
      inTransit: orders.filter((o) => o.shippingStatus?.toLowerCase().includes("transit") || o.shippingStatus?.toLowerCase().includes("picked")).length,
      delivering: orders.filter((o) => o.shippingStatus?.toLowerCase().includes("delivery")).length,
      delivered: orders.filter((o) => o.shippingStatus?.toLowerCase().includes("delivered")).length,
      failed: orders.filter((o) => o.shippingStatus?.toLowerCase().includes("failed")).length,
    }
    return stats
  }

  const stats = getStatusStats()

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Bảng điều khiển Shipper</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và cập nhật trạng thái vận chuyển đơn hàng
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ lấy hàng</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang vận chuyển</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransit}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang giao hàng</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivering}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã giao hàng</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thất bại</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tìm kiếm và lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
          <div className="mt-4 flex gap-2">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="pending">Chờ lấy hàng</TabsTrigger>
                <TabsTrigger value="picked_up">Đã lấy hàng</TabsTrigger>
                <TabsTrigger value="in_transit">Đang vận chuyển</TabsTrigger>
                <TabsTrigger value="out_for_delivery">Đang giao hàng</TabsTrigger>
                <TabsTrigger value="delivered">Đã giao hàng</TabsTrigger>
                <TabsTrigger value="failed">Thất bại</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Quản lý và cập nhật trạng thái vận chuyển cho các đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShipperOrdersTable
            orders={orders}
            onViewDetail={handleViewDetail}
            onUpdateStatus={handleUpdateStatus}
            loading={loading}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Trước
              </Button>
              <span className="flex items-center px-4">
                Trang {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      {showDetail && selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          open={showDetail}
          onOpenChange={setShowDetail}
        />
      )}

      {/* Update Status Dialog */}
      {showUpdateDialog && selectedOrder && (
        <UpdateShippingStatusDialog
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          currentStatus={selectedOrder.shippingStatus || selectedOrder.status}
          onUpdate={handleStatusUpdate}
        />
      )}
      </main>
      <Footer />
    </div>
  )
}
