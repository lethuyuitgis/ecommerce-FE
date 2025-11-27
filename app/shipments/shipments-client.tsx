"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { shipperApi, AdminShipmentDTO } from "@/lib/api/shipper"
import { ShipmentsTable } from "@/components/shipper/shipments-table"
import { UpdateShippingStatusDialog } from "@/components/shipper/update-shipping-status-dialog"
import { HeaderClient } from "@/components/common/header-client"
import { Footer } from "@/components/common/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"

interface ShipmentsClientProps {
  initialShipments: AdminShipmentDTO[]
  initialStatusFilter: string
}

export function ShipmentsClient({ 
  initialShipments, 
  initialStatusFilter 
}: ShipmentsClientProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [shipments, setShipments] = useState<AdminShipmentDTO[]>(initialShipments)
  const [loading, setLoading] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<AdminShipmentDTO | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [updatingShipmentId, setUpdatingShipmentId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter)

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
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadShipments()
    }
  }, [statusFilter])

  const loadShipments = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await shipperApi.getMyShipments(statusFilter !== 'all' ? statusFilter : undefined)
      if (response.success && response.data) {
        setShipments(response.data)
      } else {
        toast.error("Không thể tải danh sách đơn hàng")
      }
    } catch (error) {
      console.error("Error loading shipments:", error)
      toast.error("Có lỗi xảy ra khi tải đơn hàng")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (shipmentId: string) => {
    const shipment = shipments.find((s) => s.id === shipmentId)
    if (shipment) {
      setSelectedShipment(shipment)
      // Có thể mở dialog hoặc navigate đến trang chi tiết
      toast.info(`Xem chi tiết shipment: ${shipment.trackingNumber || shipment.id}`)
    }
  }

  const handleUpdateStatus = (shipmentId: string) => {
    const shipment = shipments.find((s) => s.id === shipmentId)
    if (shipment) {
      setSelectedShipment(shipment)
      setUpdatingShipmentId(shipmentId)
      setShowUpdateDialog(true)
    }
  }

  const handleStatusUpdate = async (
    status: string,
    location?: string,
    description?: string,
    failureReason?: string
  ) => {
    if (!updatingShipmentId) return

    try {
      const response = await shipperApi.updateShipmentStatus(updatingShipmentId, status)

      if (response.success) {
        toast.success("Cập nhật trạng thái thành công")
        setShowUpdateDialog(false)
        setUpdatingShipmentId(null)
        loadShipments()
      } else {
        toast.error("Không thể cập nhật trạng thái")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái")
    }
  }

  const getStatusStats = () => {
    const stats = {
      pending: shipments.filter((s) => 
        s.status.toUpperCase().includes("PENDING") || 
        s.status.toUpperCase().includes("READY_FOR_PICKUP")
      ).length,
      inTransit: shipments.filter((s) => 
        s.status.toUpperCase().includes("PICKED_UP") ||
        s.status.toUpperCase().includes("IN_TRANSIT")
      ).length,
      delivering: shipments.filter((s) => 
        s.status.toUpperCase().includes("OUT_FOR_DELIVERY")
      ).length,
      delivered: shipments.filter((s) => 
        s.status.toUpperCase().includes("DELIVERED")
      ).length,
      failed: shipments.filter((s) => 
        s.status.toUpperCase().includes("FAILED")
      ).length,
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
      <HeaderClient />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Quản lý vận đơn</h1>
          <p className="text-muted-foreground mt-2">
            Xem và cập nhật trạng thái vận chuyển cho các đơn hàng được điều phối
          </p>
        </div>

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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lọc theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="PENDING">Chờ lấy hàng</TabsTrigger>
                <TabsTrigger value="READY_FOR_PICKUP">Sẵn sàng lấy hàng</TabsTrigger>
                <TabsTrigger value="PICKED_UP">Đã lấy hàng</TabsTrigger>
                <TabsTrigger value="IN_TRANSIT">Đang vận chuyển</TabsTrigger>
                <TabsTrigger value="OUT_FOR_DELIVERY">Đang giao hàng</TabsTrigger>
                <TabsTrigger value="DELIVERED">Đã giao hàng</TabsTrigger>
                <TabsTrigger value="FAILED">Thất bại</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách vận đơn</CardTitle>
            <CardDescription>
              Quản lý và cập nhật trạng thái vận chuyển cho các đơn hàng được điều phối
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShipmentsTable
              shipments={shipments}
              onViewDetail={handleViewDetail}
              onUpdateStatus={handleUpdateStatus}
              loading={loading}
            />
          </CardContent>
        </Card>

        {showUpdateDialog && selectedShipment && (
          <UpdateShippingStatusDialog
            open={showUpdateDialog}
            onOpenChange={setShowUpdateDialog}
            currentStatus={selectedShipment.status}
            onUpdate={handleStatusUpdate}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}




